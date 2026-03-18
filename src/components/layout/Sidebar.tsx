"use client";

import { Home, AlertTriangle, FileText, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Resources", href: "/resources", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user_data");
    setIsLoggedIn(!!userData);
  }, []);

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700">Baha-Buster</h1>
        <p className="text-sm text-gray-600">Cebu City Flood Control</p>
      </div>

      <nav className="px-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "sidebar-link",
              pathname === href && "sidebar-link-active"
            )}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
        
        {/* Profile link - only show when logged in */}
        {isLoggedIn && (
          <>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              href="/profile"
              className={cn(
                "sidebar-link",
                pathname === "/profile" && "sidebar-link-active"
              )}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}