"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/src/services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(() => {
    console.log("🔄 Refreshing auth state...");
    try {
      const storedUser = localStorage.getItem("user_data");
      const storedToken = localStorage.getItem("auth_token");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ Auth refreshed:", parsedUser.email);
        setUser(parsedUser);
        setToken(storedToken);
      } else {
        console.log("ℹ️ No user data found");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("❌ Error refreshing auth:", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newUser: User, newToken?: string) => {
    console.log("✅ AuthContext: Logging in user:", newUser.email);
    setUser(newUser);
    setToken(newToken || null);
    
    localStorage.setItem("user_data", JSON.stringify(newUser));
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
    }
  }, []);

  const logout = useCallback(() => {
    console.log("🚪 AuthContext: Logging out");
    setUser(null);
    setToken(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_token");
  }, []);

  // Initial load
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Listen for storage changes (e.g., login in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "auth_token") {
        console.log("📡 Storage changed, refreshing auth");
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuth]);

  // Listen for visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Page visible, refreshing auth");
        refreshAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}