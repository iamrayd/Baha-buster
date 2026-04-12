"use client";

import { createPortal } from "react-dom";
import { Home, AlertTriangle, FileText, Package, Settings, Droplet, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useEffect, useState } from "react";

interface UserData {
  user_id: number;
  email: string;
  name: string;
  barangay: string;
}

const baseNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Resources", href: "/resources", icon: Package },
];

const settingsItem = { label: "Settings", href: "/settings", icon: Settings };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // malformed
      }
    }
  }, []);

  // Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const handleStorage = () => {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        try { setUser(JSON.parse(userData)); } catch { setUser(null); }
      } else {
        setUser(null);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) handleStorage();
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const navItems = user ? [...baseNavItems, settingsItem] : baseNavItems;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_token");
    setUser(null);
    setShowLogoutConfirm(false);
    router.push("/login");
  };

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 z-10 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)",
        boxShadow: "var(--shadow-sidebar)",
      }}
    >
      {/* ── Brand Header ────────────────────────────────────────────────── */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ background: "var(--color-primary-dark)" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Droplet size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Baha-Buster</h1>
          <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            Flood Monitoring & Alerts
          </p>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-gray-400)" }}>
          Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "sidebar-link",
                isActive && "sidebar-link-active"
              )}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── User / Guest Footer ─────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: "var(--color-gray-200)" }}>
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--color-gray-50)" }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                <User size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--color-gray-700)" }}>
                  {user.name}
                </p>
                <p className="text-[11px] truncate" style={{ color: "var(--color-gray-400)" }}>
                  {user.barangay}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-50"
              style={{ color: "var(--color-risk-high)" }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="px-3 py-3 rounded-xl text-center" style={{ background: "var(--color-gray-50)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--color-gray-400)" }}>
              Guest Mode
            </p>
            <Link
              href="/login"
              className="mt-2 block w-full py-2 rounded-lg text-xs font-semibold text-white text-center transition-colors"
              style={{ background: "var(--color-primary)" }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* ── Logout Modal ────────────────────────────────────────────────── */}
      {showLogoutConfirm && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in" style={{ zIndex: 99999 }}>
          <div
            className="bg-white w-full max-w-sm p-6 animate-scale-in"
            style={{ borderRadius: "var(--radius-modal)", boxShadow: "var(--shadow-elevated)" }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>
              Confirm Logout
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--color-gray-500)" }}>
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: "var(--color-gray-500)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2 text-white text-sm font-semibold rounded-lg transition-colors hover:opacity-90"
                style={{ background: "var(--color-risk-high)" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}