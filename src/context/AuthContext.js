import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "https://localhost:7271/api";

const ApiService = createContext();
export const useAuth = () => useContext(ApiService);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const logoutRef = useRef(null);

  const clearSession = () => {
    setUser(null);
    ["user", "token", "tenantId", "role"].forEach((k) => localStorage.removeItem(k));
  };

  // ── AXIOS INTERCEPTOR (auto-logout on 401/403) ─────────────────────────────
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          if (logoutRef.current) logoutRef.current();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const saveSession = (data, emailFallback) => {
    localStorage.setItem("token", data.token);
    if (data.tenantId) {
      localStorage.setItem("tenantId", data.tenantId);
    } else {
      localStorage.removeItem("tenantId");
    }
    localStorage.setItem("role", data.role);
    const userData = {
      email: data.email ?? emailFallback,
      role: data.role,
      name: data.username,
      username: data.username,
      userId: data.userId,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    window.location.href = "/login"; // redirect to login page
  };

  // Keep ref in sync so the interceptor always calls the latest logout
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/LoginResistarion/login`,
        { email, password }
      );
      saveSession(data, email);
      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Invalid email or password." };
    }
  };

  const sendOtp = async (email) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/LoginResistarion/send-otp`,
        { email }
      );
      return { success: true, message: data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to send OTP. Try again." };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/LoginResistarion/verify-otp`,
        { email, otp }
      );
      saveSession(data, email);
      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Invalid or expired OTP." };
    }
  };

  const sendResetLink = async (email) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/LoginResistarion/forgot-password`,
        { email }
      );
      return { success: true, message: data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Could not send reset link. Try again." };
    }
  };

  const getUserById = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_BASE_URL}/LoginResistarion/getusersbyid/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: data[0] };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to fetch user." };
    }
  };

  const uploadProfilePicture = async (file, userId) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      const { data } = await axios.post(
        `${API_BASE_URL}/LoginResistarion/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to upload image." };
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE_URL}/LoginResistarion/updateuser/${userId}`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to update profile." };
    }
  };

  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE_URL}/LoginResistarion/change-password`,
        { userId, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, message: data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message ?? "Failed to change password." };
    }
  };

  return (
    <ApiService.Provider value={{ user, login, logout, sendOtp, verifyOtp, sendResetLink, getUserById, uploadProfilePicture, updateProfile, changePassword }}>
      {children}
    </ApiService.Provider>
  );
};

export const useMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizePath = (path) => {
    if (!path) return "/app";
    if (path.startsWith("/app")) return path;
    if (path.startsWith("/")) return `/app${path}`;
    return `/app/${path}`;
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setMenus([]); setLoading(false); return; }
        const res = await fetch(`${API_BASE_URL}/Menu/get-menus`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        // ── Auto-logout if token is invalid/expired ──────────────────────────
        if (res.status === 401 || res.status === 403) {
          ["user", "token", "tenantId", "role"].forEach((k) => localStorage.removeItem(k));
          window.location.href = "/";
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const flat = await res.json();
        const map = {};
        flat.forEach((m) => { map[m.menuId] = { ...m, path: normalizePath(m.path), children: [] }; });
        const roots = [];
        flat.forEach((m) => {
          if (m.parentId && map[m.parentId]) { map[m.parentId].children.push(map[m.menuId]); }
          else { roots.push(map[m.menuId]); }
        });
        setMenus(roots);
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  return { menus, loading, error };
};