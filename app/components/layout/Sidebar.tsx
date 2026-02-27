// app/components/layout/Sidebar.tsx
"use client";

import { Home, AlertTriangle, FileText, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items configuration
const navigationItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/alerts", icon: AlertTriangle, label: "Alerts" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/resources", icon: Package, label: "Resources" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Check if the current path matches the navigation item
  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0 z-10">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700">Baha-Buster</h1>
        <p className="text-sm text-gray-600">Cebu City Flood Control</p>
      </div>

      {/* Navigation Links */}
      <nav className="px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1
                ${active 
                  ? "bg-blue-700 text-white hover:bg-blue-800" 
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}