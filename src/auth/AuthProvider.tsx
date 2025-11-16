import React, { createContext, useContext, useEffect, useState } from "react";

type AuthUser = { id: number; fullName: string; isAdmin?: boolean } | null;

type AuthContextType = {
  user: AuthUser;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = (u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("auth", JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export { AuthProvider, useAuth };