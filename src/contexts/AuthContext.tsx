"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/src/services/api";

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

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

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("session_last_active");
  }, []);

  const isSessionExpired = useCallback((): boolean => {
    const lastActive = localStorage.getItem("session_last_active");
    if (!lastActive) return true; // No timestamp means no valid session
    const elapsed = Date.now() - parseInt(lastActive, 10);
    return elapsed > SESSION_TIMEOUT_MS;
  }, []);

  const refreshAuth = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user_data");
      const storedToken = localStorage.getItem("auth_token");

      if (storedUser) {
        // Check if session has expired
        if (isSessionExpired()) {
          console.log("⏰ Session expired, clearing auth");
          clearSession();
        } else {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("❌ Error refreshing auth:", error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [isSessionExpired, clearSession]);

  const login = useCallback((newUser: User, newToken?: string) => {
    console.log("✅ AuthContext: Logging in user:", newUser.email);
    setUser(newUser);
    setToken(newToken || null);
    
    localStorage.setItem("user_data", JSON.stringify(newUser));
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
    }
    // Set session timestamp on login
    localStorage.setItem("session_last_active", Date.now().toString());
  }, []);

  const logout = useCallback(() => {
    console.log("🚪 AuthContext: Logging out");
    clearSession();
  }, [clearSession]);

  // Initial load
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Listen for storage changes (e.g., login in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "auth_token" || e.key === "session_last_active") {
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