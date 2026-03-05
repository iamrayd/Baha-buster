"use client";

import { useState } from "react";
import { AlertTriangle, MapPin, Clock, Search, SlidersHorizontal } from "lucide-react";

type AlertLevel = 1 | 2 | 3;

interface FloodAlert {
  id: number;
  title: string;
  level: AlertLevel;
  location: string;
  updatedMinsAgo: number;
}

const MOCK_ALERTS: FloodAlert[] = [
  { id: 1, title: "Critical Flood Warning", level: 3, location: "Guadalupe & Labangon", updatedMinsAgo: 15 },
  { id: 2, title: "Rising Water Level Alert", level: 2, location: "Santo Niño", updatedMinsAgo: 30 },
  { id: 3, title: "Heavy Rainfall Advisory", level: 1, location: "All Barangays", updatedMinsAgo: 45 },
  { id: 4, title: "Heavy Rainfall Advisory", level: 1, location: "All Barangays", updatedMinsAgo: 60 },
  { id: 5, title: "Heavy Rainfall Advisory", level: 1, location: "All Barangays", updatedMinsAgo: 75 },
];

const LEVEL_STYLES: Record<AlertLevel, {
  border: string;
  iconBg: string;
  iconColor: string;
  badge: string;
}> = {
  3: {
    border: "border-l-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-600",
  },
  2: {
    border: "border-l-orange-400",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    badge: "bg-orange-100 text-orange-600",
  },
  1: {
    border: "border-l-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    badge: "bg-blue-100 text-blue-600",
  },
};

export default function AlertsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_ALERTS.filter((alert) =>
    alert.location.toLowerCase().includes(search.toLowerCase()) ||
    alert.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Alerts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage and view all current warnings and flood alerts.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by barangay..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <SlidersHorizontal size={15} />
            Filter
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No alerts match your search.
          </div>
        ) : (
          filtered.map((alert) => {
            const styles = LEVEL_STYLES[alert.level];
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border border-gray-100 border-l-4 ${styles.border} shadow-sm px-5 py-4 flex items-center gap-4`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                  <AlertTriangle size={20} className={styles.iconColor} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{alert.title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                      Level {alert.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated {alert.updatedMinsAgo} mins ago
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button className="shrink-0 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}