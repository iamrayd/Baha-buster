"use client";

import { createPortal } from "react-dom";
import { Home, AlertTriangle, FileText, Package, Settings, Droplet, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";

const baseNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Resources", href: "/resources", icon: Package },
];

const settingsItem = { label: "Settings", href: "/settings", icon: Settings };

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [...baseNavItems, settingsItem];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout(); // Clears context state + localStorage + session_last_active
    setShowLogoutConfirm(false);
    window.location.href = "/login"; // Full reload to reset all state
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "w-64 h-screen fixed left-0 top-0 z-50 flex flex-col transition-transform duration-300 md:translate-x-0 hidden md:flex",
          isOpen ? "translate-x-0 flex" : "-translate-x-full"
        )}
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
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-white border border-white/20">
          <img src="/images/baha-buster-logo.png" alt="Baha-Buster Logo" className="w-full h-full object-cover" />
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
              onClick={() => {
                if (window.innerWidth < 768 && onClose) {
                  onClose();
                }
              }}
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

      {/* ── User Footer ────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: "var(--color-gray-200)" }}>
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
                {user?.name ?? ""}
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--color-gray-400)" }}>
                {user?.barangay ?? ""}
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
    </>
  );
}