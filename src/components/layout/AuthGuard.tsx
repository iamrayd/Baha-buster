"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Check session expiry on mount and when tab becomes visible
  useEffect(() => {
    const checkSession = () => {
      const lastActive = localStorage.getItem("session_last_active");
      if (lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > SESSION_TIMEOUT_MS) {
          console.log("⏰ Session expired after inactivity");
          logout();
          router.replace("/login");
          return;
        }
      }
      // Refresh timestamp while user is active
      if (user) {
        localStorage.setItem("session_last_active", Date.now().toString());
      }
    };

    checkSession();

    const handleVisibility = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    // Refresh activity timestamp on user interaction
    const handleActivity = () => {
      if (user) {
        localStorage.setItem("session_last_active", Date.now().toString());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", checkSession);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Periodic check every 60 seconds
    const interval = setInterval(checkSession, 60_000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", checkSession);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(interval);
    };
  }, [user, logout, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-medium" style={{ color: "var(--color-gray-400)" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — don't render children (redirect is happening)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
