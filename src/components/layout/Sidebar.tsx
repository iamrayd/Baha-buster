"use client";

import { createPortal } from "react-dom";
import { Home, AlertTriangle, FileText, Package, Settings, Droplet, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const collapsed = isCollapsed && !isOpen;

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
          "h-[100dvh] fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 md:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full md:flex",
          collapsed ? "md:w-20" : "md:w-64"
        )}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)",
          boxShadow: "var(--shadow-sidebar)",
        }}
      >
      {/* ── Collapse Toggle ─────────────────────────────────────────────── */}
      <button 
        onClick={onToggleCollapse} 
        className="hidden md:flex absolute -right-3 top-7 items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full z-50 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* ── Brand Header ────────────────────────────────────────────────── */}
      <div
        className={cn("px-6 py-5 flex items-center gap-3", collapsed && "justify-center px-0")}
        style={{ background: "var(--color-primary-dark)" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-white border border-white/20">
          <img src="/images/baha-buster-logo.png" alt="Baha-Buster Logo" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Baha-Buster</h1>
            <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Flood Monitoring & Alerts
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-gray-400)" }}>
            Menu
          </p>
        )}
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
                isActive && "sidebar-link-active",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer ────────────────────────────────────────────────── */}
      <div className={cn("px-3 pb-4 pt-2 border-t", collapsed && "px-2")} style={{ borderColor: "var(--color-gray-200)" }}>
        {!collapsed ? (
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
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--color-primary)", color: "#fff" }}
              title={user?.name ?? ""}
            >
              <User size={16} />
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-50"
              style={{ color: "var(--color-risk-high)" }}
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
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
    </>
  );
}