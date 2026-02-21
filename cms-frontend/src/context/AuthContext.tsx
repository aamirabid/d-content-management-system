"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // initialize from token if present and fetch full user details
    const t = (typeof window !== "undefined" && localStorage.getItem("d_cms_token")) || null;
    if (t) {
      try {
        import("../lib/api/client").then(async ({ decodeJwt, authFetch }) => {
          const payload: any = decodeJwt(t);
          const basicUser: User = { id: payload?.sub || "", email: payload?.email || "", firstName: "", lastName: "", isActive: true } as any;
          setUser(basicUser);
          
          // Fetch full user details with permissions
          try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const meRes = await authFetch(`${api}/auth/me`);
            if (meRes.ok) {
              const meData = await meRes.json();
              const fullUser = meData.data || meData;
              setUser(fullUser);
            }
          } catch (e) {
            console.warn("Failed to fetch full user details, using JWT data:", e);
          }
          setLoading(false);
        });
      } catch (e) {
        setUser(null);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    const url = (process.env.NEXT_PUBLIC_API_URL || "") + "/auth/login";
    console.log("[AuthContext] Logging in to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    console.log("[AuthContext] Login response status:", res.status);
    if (!res.ok) throw new Error("Login failed (" + res.status + ")");
    const data = await res.json();
    console.log("[AuthContext] Response data:", data);
    // Backend wraps response in { success: true, data: { accessToken: "..." } }
    const token = data?.data?.accessToken || data?.accessToken || data?.token;
    console.log("[AuthContext] Extracted token:", token ? "present" : "NOT FOUND");
    if (!token) throw new Error("No token received");
    try {
      localStorage.setItem("d_cms_token", token);
      // Also set a simple auth cookie for middleware to check
      document.cookie = `token=1; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      console.log("[AuthContext] Token stored in localStorage and auth cookie set");
      const { decodeJwt, authFetch } = await import("../lib/api/client");
      const payload: any = decodeJwt(token);
      console.log("[AuthContext] Decoded JWT payload:", payload);
      const u: User = { id: payload?.sub || "", email: payload?.email || "", firstName: "", lastName: "", isActive: true } as any;
      setUser(u);
      
      // Fetch full user details with roles and permissions
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const meRes = await authFetch(`${api}/auth/me`);
        if (meRes.ok) {
          const meData = await meRes.json();
          const fullUser = meData.data || meData;
          console.log("[AuthContext] Full user details fetched:", fullUser);
          setUser(fullUser);
        }
      } catch (e) {
        console.warn("Failed to fetch full user details:", e);
      }
      console.log("[AuthContext] User state updated:", u);
    } catch (e) {
      console.error("[AuthContext] Error storing/decoding token:", e);
      // still store token but set minimal user
      setUser({ id: "", email, firstName: "", lastName: "", isActive: true } as any);
    }
  }

  function logout() {
    localStorage.removeItem("d_cms_token");
    // Clear auth cookie
    document.cookie = `token=; path=/; max-age=0`;
    setUser(null);
    window.location.href = "/admin/login";
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
