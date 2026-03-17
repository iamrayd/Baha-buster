"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Search, SlidersHorizontal, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { BarangayFloodData, RiskLevel } from "@/src/types/global";
import { fetchAllForecasts } from "@/src/services/api";

const CACHE_KEY = "baha_buster_data_v1";

type FilterLevel = "ALL" | "HIGH" | "MEDIUM" | "LOW";

const LEVEL_STYLES: Record<RiskLevel, {
  border: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  dayBg: string;
}> = {
  HIGH: {
    border: "border-l-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-600",
    dayBg: "bg-red-50",
  },
  MEDIUM: {
    border: "border-l-orange-400",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    badge: "bg-orange-100 text-orange-600",
    dayBg: "bg-orange-50",
  },
  LOW: {
    border: "border-l-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    badge: "bg-blue-100 text-blue-600",
    dayBg: "bg-blue-50",
  },
};

const DAY_RISK_COLORS: Record<RiskLevel, string> = {
  HIGH: "text-red-600 font-semibold",
  MEDIUM: "text-orange-500 font-semibold",
  LOW: "text-blue-500",
};

function getAlertTitle(risk: RiskLevel): string {
  if (risk === "HIGH") return "Critical Flood Warning";
  if (risk === "MEDIUM") return "Rising Water Level Alert";
  return "Flood Advisory";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Helper function to safely extract the risk level for Day 1
const getRisk = (b: BarangayFloodData): RiskLevel => b.predictions?.[0]?.risk_level || "LOW";

export default function AlertsPage() {
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("ALL");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    fetchAllForecasts()
      .then((json: BarangayFloodData[]) => {
        setData(json);
        setLoading(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify(json));
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (barangay: string) => {
    setExpanded((prev) => ({ ...prev, [barangay]: !prev[barangay] }));
  };

  const atRisk = data
    .filter((b) => {
      const risk = getRisk(b);
      return risk === "HIGH" || risk === "MEDIUM" || risk === "LOW";
    })
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[getRisk(a)] - order[getRisk(b)];
    });

  const filtered = atRisk.filter((b) => {
    const matchesSearch = b.barangay.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "ALL" || getRisk(b) === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const highCount = atRisk.filter((b) => getRisk(b) === "HIGH").length;
  const mediumCount = atRisk.filter((b) => getRisk(b) === "MEDIUM").length;
  const lowCount = atRisk.filter((b) => getRisk(b) === "LOW").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Alerts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage and view all current warnings and flood alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by barangay..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
          <div className="relative">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as FilterLevel)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
            <SlidersHorizontal size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Badges */}
      {!loading && atRisk.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500">
            {atRisk.length} barangay{atRisk.length !== 1 ? "s" : ""} at risk:
          </span>
          {highCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              {highCount} Critical
            </span>
          )}
          {mediumCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {mediumCount} Moderate
            </span>
          )}
          {lowCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {lowCount} Low
            </span>
          )}
        </div>
      )}

      {/* Alert Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
            <CheckCircle size={36} className="text-green-400 mb-3" />
            <p className="font-medium text-gray-700">
              {search || filterLevel !== "ALL"
                ? "No alerts match your search."
                : "No active flood alerts."}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {!search && filterLevel === "ALL" && "All barangays are currently at low risk."}
            </p>
          </div>
        ) : (
          filtered.map((barangay) => {
            // FIXED: Use getRisk() helper
            const risk = getRisk(barangay);
            const styles = LEVEL_STYLES[risk];
            const isExpanded = expanded[barangay.barangay] ?? false;
            const currentDepth = barangay.predictions?.[0]?.predicted_depth_cm ?? 0;

            return (
              <div
                key={barangay.barangay}
                className={`bg-white rounded-xl border border-gray-100 border-l-4 ${styles.border} shadow-sm overflow-hidden`}
              >
                {/* Main Row */}
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                    <AlertTriangle size={20} className={styles.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {getAlertTitle(risk)}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                        {risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>{barangay.barangay}</span>
                      <span className="mx-1">·</span>
                      {/* FIXED: Replaced non-existent rainfall with current depth */}
                      <span>Predicted Depth: {currentDepth.toFixed(2)} cm</span>
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => toggleExpand(barangay.barangay)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {isExpanded ? (
                      <>Hide Forecast <ChevronUp size={13} /></>
                    ) : (
                      <>View Forecast <ChevronDown size={13} /></>
                    )}
                  </button>
                </div>

                {/* 3-Day Forecast Breakdown */}
                {isExpanded && (
                  <div className={`px-5 pb-4 ${styles.dayBg} border-t border-gray-100`}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3 mb-3">
                      3-Day Forecast
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* FIXED: Loop over predictions instead of forecasts */}
                      {barangay.predictions?.slice(0, 3).map((prediction, index) => {
                        // Create a date based on the prediction day (Day 1 = Today)
                        const forecastDate = new Date();
                        forecastDate.setDate(forecastDate.getDate() + (prediction.day - 1));

                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-100 px-4 py-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-700">
                                Day {prediction.day}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(forecastDate.toISOString())}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Flood Depth</span>
                                <span className="font-semibold text-gray-800">
                                  {prediction.predicted_depth_cm.toFixed(2)} cm
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Probability</span>
                                <span className="font-semibold text-gray-800">
                                  {/* FIXED: Converted decimal to percent */}
                                  {(prediction.flood_probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Risk</span>
                                <span className={DAY_RISK_COLORS[prediction.risk_level]}>
                                  {prediction.risk_level}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}