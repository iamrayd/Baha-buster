"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Info,
  AlertOctagon,
  CheckCircle,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  fetchAlertsByBarangay,
  BarangayAlertApiResponse,
  User,
} from "@/src/services/api";
import AddAlertModal from "@/src/features/alerts/AddAlertModal";

// ─── Severity Config ──────────────────────────────────────────────────────────

type Severity = BarangayAlertApiResponse["severity"];

const SEVERITY_CONFIG: Record<
  Severity,
  {
    label: string;
    color: string;
    bg: string;
    iconBg: string;
    icon: typeof Info;
    borderColor: string;
  }
> = {
  low: {
    label: "LOW",
    color: "#3b82f6",
    bg: "#eff6ff",
    iconBg: "#dbeafe",
    icon: Info,
    borderColor: "#dbeafe",
  },
  moderate: {
    label: "MODERATE",
    color: "#ed8936",
    bg: "#fffaf0",
    iconBg: "#feebc8",
    icon: AlertTriangle,
    borderColor: "#feebc8",
  },
  high: {
    label: "HIGH",
    color: "#e53e3e",
    bg: "#fff5f5",
    iconBg: "#fed7d7",
    icon: AlertTriangle,
    borderColor: "#fed7d7",
  },
  critical: {
    label: "HIGH",
    color: "#e53e3e",
    bg: "#fff5f5",
    iconBg: "#fed7d7",
    icon: AlertTriangle,
    borderColor: "#fed7d7",
  },
};

// ─── Time Helpers ─────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = new Date();
  
  let parsed = dateString;
  if (parsed && !/(Z|[+-]\d{2}:\d{2})$/.test(parsed)) {
    parsed = parsed.replace(' ', 'T') + 'Z';
  }
  
  let date = new Date(parsed);
  if (isNaN(date.getTime())) date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMs < 0) return "Just now";
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<BarangayAlertApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "moderate" | "high">("all");

  // Load user from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        /* guest */
      }
    }
  }, []);

  // Fetch alerts for user's barangay
  const fetchAlerts = async () => {
    if (!user?.barangay) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlertsByBarangay(user.barangay);
      // Sort newest first
      const sorted = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAlerts(sorted);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Unable to load alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.barangay) {
      fetchAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.barangay]);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleAlertSuccess = () => {
    setSuccessMsg("Alert sent successfully!");
    // Re-fetch alerts after creating a new one
    fetchAlerts();
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "high" && alert.severity === "critical") return true;
    return alert.severity === filter;
  });

  return (
    <div className="space-y-6 w-full pb-8">

      {/* Success toast */}
      {successMsg && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 text-white text-sm font-semibold px-5 py-3 animate-slide-up"
          style={{
            background: "var(--color-risk-low)",
            borderRadius: "var(--radius-input)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <CheckCircle size={17} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-gray-700)" }}
          >
            Alerts
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
            {user?.barangay
              ? `Alerts sent to Barangay ${user.barangay}`
              : "View alerts sent to your barangay."}
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px shrink-0"
            style={{
              background: "var(--color-risk-high)",
              borderRadius: "var(--radius-button)",
              boxShadow: "0 2px 8px rgba(229,62,62,0.25)",
            }}
          >
            <Plus size={16} />
            Send Alert
          </button>
        )}
      </div>

      {/* Filters */}
      {!loading && !error && alerts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "high", "moderate", "low"] as const).map((f) => {
            const isActive = filter === f;
            let activeBg = "var(--color-gray-700)";
            if (f === "low") activeBg = SEVERITY_CONFIG.low.color;
            if (f === "moderate") activeBg = SEVERITY_CONFIG.moderate.color;
            if (f === "high") activeBg = SEVERITY_CONFIG.high.color;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-200 ${
                  isActive ? "shadow-sm" : "hover:bg-gray-100"
                }`}
                style={{
                  borderRadius: "var(--radius-full)",
                  background: isActive ? activeBg : "transparent",
                  color: isActive ? "#ffffff" : "var(--color-gray-500)",
                  border: `1px solid ${isActive ? activeBg : "var(--color-gray-200)"}`,
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white px-5 py-6 animate-pulse"
                style={{
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full shrink-0"
                    style={{ background: "var(--color-gray-100)" }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-4 w-1/3 rounded"
                      style={{ background: "var(--color-gray-100)" }}
                    />
                    <div
                      className="h-3 w-1/4 rounded"
                      style={{ background: "var(--color-gray-100)" }}
                    />
                    <div
                      className="h-3 w-2/3 rounded mt-2"
                      style={{ background: "var(--color-gray-100)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            className="flex flex-col items-center justify-center py-16 bg-white"
            style={{
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <AlertTriangle
              size={36}
              className="mb-3"
              style={{ color: "var(--color-risk-medium)" }}
            />
            <p
              className="font-semibold"
              style={{ color: "var(--color-gray-700)" }}
            >
              {error}
            </p>
            <button
              onClick={fetchAlerts}
              className="flex items-center gap-2 mt-4 px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{
                background: "var(--color-primary)",
                borderRadius: "var(--radius-button)",
              }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty state (Total) */}
        {!loading && !error && alerts.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 bg-white"
            style={{
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <CheckCircle
              size={36}
              className="mb-3"
              style={{ color: "var(--color-risk-low)" }}
            />
            <p
              className="font-semibold"
              style={{ color: "var(--color-gray-700)" }}
            >
              No alerts for your barangay
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-gray-400)" }}
            >
              You&apos;re all clear — no alerts have been sent.
            </p>
          </div>
        )}

        {/* Empty state (Filtered) */}
        {!loading && !error && alerts.length > 0 && filteredAlerts.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-12 bg-white"
            style={{
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-gray-100)",
            }}
          >
            <Info size={32} className="mb-2" style={{ color: "var(--color-gray-300)" }} />
            <p className="font-medium text-sm" style={{ color: "var(--color-gray-500)" }}>
              No {filter} alerts found
            </p>
          </div>
        )}

        {/* Alerts list */}
        {!loading &&
          !error &&
          filteredAlerts.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.low;
            const IconComponent = config.icon;

            return (
              <div
                key={alert.id}
                className="bg-white overflow-hidden transition-all duration-200 hover:shadow-md"
                style={{
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  borderLeft: `4px solid ${config.color}`,
                }}
              >
                <div className="px-5 py-4">
                  {/* Top row: icon + title + badge + time */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: config.iconBg }}
                    >
                      <IconComponent size={20} style={{ color: config.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-bold text-[15px]"
                          style={{ color: "var(--color-gray-700)" }}
                        >
                          {alert.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[10px] font-bold uppercase px-2.5 py-0.5"
                          style={{
                            background: config.bg,
                            color: config.color,
                            borderRadius: "var(--radius-badge)",
                          }}
                        >
                          {config.label}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--color-gray-400)" }}
                        >
                          · {timeAgo(alert.created_at)}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm mt-2.5 leading-relaxed"
                        style={{ color: "var(--color-gray-600)" }}
                      >
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Add Alert Modal */}
      {showModal && (
        <AddAlertModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAlertSuccess}
          userBarangay={user?.barangay || ""}
        />
      )}
    </div>
  );
}