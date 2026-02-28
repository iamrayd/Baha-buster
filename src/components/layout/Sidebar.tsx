"use client";

import { Home, AlertTriangle, FileText, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Resources", href: "/resources", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

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
      </nav>
    </aside>
  );
}