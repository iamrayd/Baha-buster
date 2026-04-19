"use client";

import { useState } from "react";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";
import AuthGuard from "@/src/components/layout/AuthGuard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen" style={{ background: "var(--color-surface)" }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-8 w-full animate-fade-in overflow-x-hidden">
            {children}
          </main>
          <footer
            className="py-4 px-8 text-xs text-center"
            style={{ color: "var(--color-gray-400)", borderTop: "1px solid var(--color-gray-100)" }}
          >
            © {new Date().getFullYear()} Baha-Buster. Cebu City Flood Control System.
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}