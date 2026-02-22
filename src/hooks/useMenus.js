// hooks/useMenus.js
import { useState, useEffect } from "react";

const API_BASE_URL = "https://localhost:7271/api";

/**
 * Fetches role-based menus from the backend.
 * Returns a structured list:
 *   [
 *     { menuId, menuName, path, icon, parentId, isActive, children: [...] },
 *     ...
 *   ]
 */
export const useMenus = () => {
  const [menus, setMenus]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMenus([]);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/Menu/get-menus`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const flat = await res.json(); // flat array from backend

        // ── Build parent → children tree ──────────────────────────────
        const map = {};
        flat.forEach((m) => {
          map[m.menuId] = { ...m, children: [] };
        });

        const roots = [];
        flat.forEach((m) => {
          if (m.parentId && map[m.parentId]) {
            map[m.parentId].children.push(map[m.menuId]);
          } else {
            roots.push(map[m.menuId]);
          }
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