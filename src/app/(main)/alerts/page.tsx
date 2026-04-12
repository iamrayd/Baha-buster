"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Search,
  SlidersHorizontal,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { BarangayFloodData, RiskLevel } from "@/src/types/global";
import { fetchAllForecasts, User } from "@/src/services/api";
import AddAlertModal from "@/src/features/alerts/AddAlertModal";

const CACHE_KEY = "baha_buster_data_v1";

type FilterLevel = "ALL" | "HIGH" | "MEDIUM" | "LOW";

const RISK_COLORS: Record<RiskLevel, {
  border: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  dayBg: string;
}> = {
  HIGH: {
    border:     "var(--color-risk-high)",
    iconBg:     "var(--color-risk-high-bg)",
    iconColor:  "var(--color-risk-high)",
    badgeBg:    "var(--color-risk-high-bg)",
    badgeColor: "var(--color-risk-high)",
    dayBg:      "var(--color-risk-high-bg)",
  },
  MEDIUM: {
    border:     "var(--color-risk-medium)",
    iconBg:     "var(--color-risk-medium-bg)",
    iconColor:  "var(--color-risk-medium)",
    badgeBg:    "var(--color-risk-medium-bg)",
    badgeColor: "var(--color-risk-medium)",
    dayBg:      "var(--color-risk-medium-bg)",
  },
  LOW: {
    border:     "var(--color-risk-low)",
    iconBg:     "var(--color-risk-low-bg)",
    iconColor:  "var(--color-risk-low)",
    badgeBg:    "var(--color-risk-low-bg)",
    badgeColor: "var(--color-risk-low)",
    dayBg:      "var(--color-risk-low-bg)",
  },
};

const DAY_RISK_STYLES: Record<RiskLevel, { color: string }> = {
  HIGH:   { color: "var(--color-risk-high)" },
  MEDIUM: { color: "var(--color-risk-medium)" },
  LOW:    { color: "var(--color-risk-low)" },
};

function getAlertTitle(risk: RiskLevel): string {
  if (risk === "HIGH")   return "Critical Flood Warning";
  if (risk === "MEDIUM") return "Rising Water Level Alert";
  return "Flood Advisory";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });
}

const getRisk = (b: BarangayFloodData): RiskLevel =>
  b.predictions?.[0]?.risk_level || "LOW";

export default function AlertsPage() {
  const [data, setData]               = useState<BarangayFloodData[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("ALL");
  const [expanded, setExpanded]       = useState<Record<string, boolean>>({});
  const [showModal, setShowModal]     = useState(false);
  const [successMsg, setSuccessMsg]   = useState<string | null>(null);
  const [user, setUser]               = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      try { setUser(JSON.parse(raw) as User); } catch { /* guest */ }
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) { setData(parsed); setLoading(false); }
      } catch { /* ignore */ }
    }

    fetchAllForecasts()
      .then((json) => { setData(json); setLoading(false); localStorage.setItem(CACHE_KEY, JSON.stringify(json)); })
      .catch((err) => { console.error("Fetch error:", err); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  function toggleExpand(barangay: string) {
    setExpanded((prev) => ({ ...prev, [barangay]: !prev[barangay] }));
  }

  const atRisk = data
    .filter((b) => { const r = getRisk(b); return r === "HIGH" || r === "MEDIUM" || r === "LOW"; })
    .sort((a, b) => { const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }; return order[getRisk(a)] - order[getRisk(b)]; });

  const filtered = atRisk.filter((b) => {
    const matchesSearch = b.barangay.toLowerCase().includes(search.toLowerCase());
    const matchesLevel  = filterLevel === "ALL" || getRisk(b) === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const highCount   = atRisk.filter((b) => getRisk(b) === "HIGH").length;
  const mediumCount = atRisk.filter((b) => getRisk(b) === "MEDIUM").length;
  const lowCount    = atRisk.filter((b) => getRisk(b) === "LOW").length;

  return (
    <div className="space-y-6">
      {/* Success toast */}
      {successMsg && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 text-white text-sm font-semibold px-5 py-3 animate-slide-up"
          style={{ background: "var(--color-risk-low)", borderRadius: "var(--radius-input)", boxShadow: "var(--shadow-elevated)" }}
        >
          <CheckCircle size={17} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Active Alerts</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
            Manage and view all current warnings and flood alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
            <input
              type="text" placeholder="Search barangay..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border focus:outline-none focus:ring-2 w-48"
              style={{ borderRadius: "var(--radius-input)", borderColor: "var(--color-gray-200)", background: "var(--color-card)" }}
            />
          </div>

          <div className="relative">
            <select
              value={filterLevel} onChange={(e) => setFilterLevel(e.target.value as FilterLevel)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border focus:outline-none focus:ring-2 cursor-pointer"
              style={{ borderRadius: "var(--radius-input)", borderColor: "var(--color-gray-200)", background: "var(--color-card)" }}
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
            <SlidersHorizontal size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-gray-400)" }} />
          </div>

          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
              style={{ background: "var(--color-risk-high)", borderRadius: "var(--radius-button)", boxShadow: "0 2px 8px rgba(229,62,62,0.25)" }}
            >
              <Plus size={16} />
              Add Alert
            </button>
          )}
        </div>
      </div>

      {/* Summary badges */}
      {!loading && atRisk.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm" style={{ color: "var(--color-gray-500)" }}>
            {atRisk.length} barangay{atRisk.length !== 1 ? "s" : ""} at risk:
          </span>
          {highCount > 0 && (
            <span className="px-3 py-1 text-xs font-bold" style={{ background: "var(--color-risk-high-bg)", color: "var(--color-risk-high)", borderRadius: "var(--radius-badge)" }}>
              {highCount} Critical
            </span>
          )}
          {mediumCount > 0 && (
            <span className="px-3 py-1 text-xs font-bold" style={{ background: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)", borderRadius: "var(--radius-badge)" }}>
              {mediumCount} Moderate
            </span>
          )}
          {lowCount > 0 && (
            <span className="px-3 py-1 text-xs font-bold" style={{ background: "var(--color-risk-low-bg)", color: "var(--color-risk-low)", borderRadius: "var(--radius-badge)" }}>
              {lowCount} Low
            </span>
          )}
        </div>
      )}

      {/* Alert cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white px-5 py-5 h-20 animate-pulse" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
            <CheckCircle size={36} className="mb-3" style={{ color: "var(--color-risk-low)" }} />
            <p className="font-semibold" style={{ color: "var(--color-gray-700)" }}>
              {search || filterLevel !== "ALL" ? "No alerts match your search." : "No active flood alerts."}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
              {!search && filterLevel === "ALL" && "All barangays are currently at low risk."}
            </p>
          </div>
        ) : (
          filtered.map((barangay) => {
            const risk         = getRisk(barangay);
            const colors       = RISK_COLORS[risk];
            const isExpanded   = expanded[barangay.barangay] ?? false;
            const currentDepth = barangay.predictions?.[0]?.predicted_depth_cm ?? 0;

            return (
              <div
                key={barangay.barangay}
                className="bg-white overflow-hidden transition-shadow duration-200 hover:shadow-md"
                style={{
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  borderLeft: `4px solid ${colors.border}`,
                }}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: colors.iconBg }}
                  >
                    <AlertTriangle size={20} style={{ color: colors.iconColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: "var(--color-gray-700)" }}>
                        {getAlertTitle(risk)}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase px-2.5 py-0.5"
                        style={{ background: colors.badgeBg, color: colors.badgeColor, borderRadius: "var(--radius-badge)" }}
                      >
                        {risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--color-gray-500)" }}>
                      <MapPin size={12} />
                      <span>{barangay.barangay}</span>
                      <span className="mx-1">·</span>
                      <span>Predicted Depth: {currentDepth.toFixed(2)} cm</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(barangay.barangay)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold border px-3 py-2 transition-all duration-200 hover:bg-gray-50"
                    style={{ borderRadius: "var(--radius-button)", borderColor: "var(--color-gray-200)", color: "var(--color-gray-500)" }}
                  >
                    {isExpanded ? (
                      <>Hide Forecast <ChevronUp size={13} /></>
                    ) : (
                      <>View Forecast <ChevronDown size={13} /></>
                    )}
                  </button>
                </div>

                {/* 3-day forecast breakdown */}
                {isExpanded && (
                  <div className="px-5 pb-4" style={{ background: colors.dayBg, borderTop: "1px solid var(--color-gray-100)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest pt-3 mb-3" style={{ color: "var(--color-gray-500)" }}>
                      3-Day Forecast
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {barangay.predictions?.slice(0, 3).map((prediction, index) => {
                        const forecastDate = new Date();
                        forecastDate.setDate(forecastDate.getDate() + (prediction.day - 1));

                        return (
                          <div
                            key={index}
                            className="bg-white px-4 py-3 space-y-2"
                            style={{ borderRadius: "var(--radius-input)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold" style={{ color: "var(--color-gray-700)" }}>
                                Day {prediction.day}
                              </span>
                              <span className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>
                                {formatDate(forecastDate.toISOString())}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span style={{ color: "var(--color-gray-500)" }}>Flood Depth</span>
                                <span className="font-semibold" style={{ color: "var(--color-gray-700)" }}>
                                  {prediction.predicted_depth_cm.toFixed(2)} cm
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span style={{ color: "var(--color-gray-500)" }}>Probability</span>
                                <span className="font-semibold" style={{ color: "var(--color-gray-700)" }}>
                                  {(prediction.flood_probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span style={{ color: "var(--color-gray-500)" }}>Risk</span>
                                <span className="font-bold" style={{ color: DAY_RISK_STYLES[prediction.risk_level].color }}>
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

      {/* Add Alert Modal */}
      {showModal && (
        <AddAlertModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setSuccessMsg("Alert sent successfully!")}
        />
      )}
    </div>
  );
}