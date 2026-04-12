"use client";

import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Real-time flood monitoring overview" },
  "/alerts":    { title: "Active Alerts", subtitle: "Current warnings and flood alerts" },
  "/reports":   { title: "Reports", subtitle: "Community flood reports" },
  "/resources": { title: "Resources", subtitle: "Emergency contacts and guides" },
  "/settings":  { title: "Profile", subtitle: "Account settings and preferences" },
};

export default function Header() {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] || { title: "Baha-Buster", subtitle: "Cebu City Flood Control" };

  return (
    <header
      className="h-16 flex items-center justify-between px-8 shrink-0 sticky top-0 z-[5]"
      style={{
        background: "rgba(247, 250, 252, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-gray-200)",
      }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>
          {pageInfo.title}
        </h2>
        <p className="text-[11px] font-medium" style={{ color: "var(--color-gray-400)" }}>
          {pageInfo.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.reload()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white"
          style={{ color: "var(--color-gray-400)" }}
          title="Refresh data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}