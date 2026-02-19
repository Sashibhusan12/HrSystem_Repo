import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ✅ Base Address
const API_BASE_URL = "https://localhost:7271/api/LoginResistarion";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // ================= LOGIN (REAL API) =================
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const data = response.data;

      // Save JWT token
      localStorage.setItem("token", data.token);
      localStorage.setItem("tenantId", data.tenantId);
      localStorage.setItem("role", data.role);

      // Save user object
      const userData = {
        email: email,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
