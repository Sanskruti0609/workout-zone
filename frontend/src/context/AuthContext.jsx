import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/admin/me").then((r) => setUser(r.data)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setUser(r.data);
  }, []);

  const logout = useCallback(async () => {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
