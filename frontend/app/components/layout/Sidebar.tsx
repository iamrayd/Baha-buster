// components/layout/Sidebar.tsx
"use client";

import { Home, AlertTriangle, FileText, Package, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700">Baha-Buster</h1>
        <p className="text-sm text-gray-600">Cebu City Flood Control</p>
      </div>

      <nav className="px-4">
        <a href="#" className="sidebar-link sidebar-link-active">
          <Home size={20} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="sidebar-link">
          <AlertTriangle size={20} />
          <span>Alerts</span>
        </a>
        <a href="#" className="sidebar-link">
          <FileText size={20} />
          <span>Reports</span>
        </a>
        <a href="#" className="sidebar-link">
          <Package size={20} />
          <span>Resources</span>
        </a>
        <a href="#" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}