import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = "https://localhost:7271/api/LoginResistarion";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // ── Shared session helper ──────────────────────────────────────────────────
  const saveSession = (data, emailFallback) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("tenantId", data.tenantId);
    localStorage.setItem("role", data.role);
    const userData = { email: data.email ?? emailFallback, role: data.role };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const clearSession = () => {
    setUser(null);
    ["user", "token", "tenantId", "role"].forEach((k) => localStorage.removeItem(k));
  };

  // ── PASSWORD LOGIN ─────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password });
      saveSession(data, email);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Invalid email or password." };
    }
  };

  // ── SEND OTP ───────────────────────────────────────────────────────────────
  const sendOtp = async (email) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/send-otp`, { email });
      return { success: true, message: data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to send OTP. Try again." };
    }
  };

  // ── VERIFY OTP & LOGIN ─────────────────────────────────────────────────────
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      saveSession(data, email);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Invalid or expired OTP." };
    }
  };

  // ── SEND RESET LINK ────────────────────────────────────────────────────────
  // Expects backend: POST /forgot-password  body: { email }
  // Returns: 200 { message: "Reset link sent" }  |  400 { message: "..." }
  const sendResetLink = async (email) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      return { success: true, message: data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Could not send reset link. Try again." };
    }
  };

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = () => clearSession();

  return (
    <AuthContext.Provider value={{ user, login, logout, sendOtp, verifyOtp, sendResetLink }}>
      {children}
    </AuthContext.Provider>
  );
};