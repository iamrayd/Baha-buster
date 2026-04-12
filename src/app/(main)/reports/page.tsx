"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  AlertCircle,
  MapPin,
  Calendar,
  Filter,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  X,
  User as UserIcon,
} from "lucide-react";
import {
  getAllReports,
  getReportsByBarangay,
  Report,
} from "@/src/services/api";

interface UserData {
  user_id: number;
  email: string;
  name: string;
  barangay: string;
}

const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  low: { label: "Low", bg: "var(--color-risk-low-bg)", color: "var(--color-risk-low)" },
  ankle: { label: "Ankle Deep", bg: "var(--color-risk-low-bg)", color: "var(--color-risk-low)" },
  knee: { label: "Knee Deep", bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)" },
  waist: { label: "Waist Deep", bg: "var(--color-risk-high-bg)", color: "var(--color-risk-high)" },
  moderate: { label: "Moderate", bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)" },
  high: { label: "High", bg: "var(--color-risk-high-bg)", color: "var(--color-risk-high)" },
  critical: { label: "Critical", bg: "#faf5ff", color: "#6b46c1" },
};

function getSeverityConfig(severity?: string) {
  if (!severity) return SEVERITY_CONFIG.low;
  return SEVERITY_CONFIG[severity.toLowerCase()] ?? SEVERITY_CONFIG.low;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [barangayFilter, setBarangayFilter] = useState<string>("ALL");

  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      try { setUser(JSON.parse(raw) as UserData); } catch { /* guest */ }
    }
    setAuthResolved(true);
  }, []);

  useEffect(() => {
    if (!authResolved) return;

    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);
        if (user) {
          const data = await getReportsByBarangay(user.barangay);
          setReports(data);
        } else {
          setIsFetchingAll(true);
          const data = await getAllReports();
          setReports(data);
          setIsFetchingAll(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
        setIsFetchingAll(false);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [authResolved, user]);

  const uniqueSeverities = Array.from(new Set(reports.map((r) => r.severity.toLowerCase())));
  const uniqueBarangays = Array.from(new Set(reports.map((r) => r.user_barangay))).sort();

  const filteredReports = reports.filter((report) => {
    const matchesSeverity = severityFilter === "ALL" || report.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesBarangay = barangayFilter === "ALL" || report.user_barangay === barangayFilter;
    return matchesSeverity && matchesBarangay;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 size={40} className="animate-spin mx-auto" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold" style={{ color: "var(--color-gray-700)" }}>Loading reports...</p>
          {isFetchingAll && (
            <p className="text-sm" style={{ color: "var(--color-gray-400)" }}>
              Fetching reports across all barangays — this may take a moment.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Reports</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
          {user ? `Showing flood reports for ${user.barangay}` : "Showing all flood reports across Cebu City"}
        </p>
      </div>

      {/* Guest notice */}
      {!user && (
        <div
          className="flex items-start gap-3 p-4 text-sm"
          style={{ background: "rgba(44, 82, 130, 0.06)", color: "var(--color-primary)", borderRadius: "var(--radius-card)" }}
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5 opacity-70" />
          <p>
            You are viewing all barangay reports.{" "}
            <a href="/login" className="font-semibold underline">Sign in</a>{" "}
            to see reports specific to your barangay.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 p-4"
          style={{ background: "var(--color-risk-high-bg)", borderRadius: "var(--radius-card)" }}
        >
          <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: "var(--color-risk-high)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--color-risk-high)" }}>Error loading reports</p>
            <p className="text-sm mt-1 opacity-80" style={{ color: "var(--color-risk-high)" }}>{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white p-6" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-gray-500)" }}>Total Reports</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "var(--color-gray-700)" }}>{reports.length}</p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(44, 82, 130, 0.1)" }}
          >
            <FileText size={24} style={{ color: "var(--color-primary)" }} />
          </div>
        </div>
      </div>

      {/* Filters (Pills) */}
      <div className="space-y-4">
        {/* Severity Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={16} style={{ color: "var(--color-gray-400)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--color-gray-600)" }}>Severity:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            <button
              onClick={() => setSeverityFilter("ALL")}
              className={`snap-start px-4 py-1.5 rounded-full text-[13px] tracking-wide font-bold uppercase transition-all ${severityFilter === "ALL" ? "shadow-md" : "hover:bg-gray-50 border border-gray-200"
                }`}
              style={severityFilter === "ALL" ? { background: "var(--color-primary)", color: "white" } : { background: "white", color: "var(--color-gray-500)" }}
            >
              All Severities
            </button>
            {uniqueSeverities.map((s) => {
              const isActive = severityFilter === s;
              const config = getSeverityConfig(s);
              return (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`snap-start px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide whitespace-nowrap transition-all ${isActive ? "shadow-md ring-2 ring-offset-1" : "border"
                    }`}
                  style={{
                    backgroundColor: isActive ? config.color : "white",
                    color: isActive ? "white" : config.color,
                    borderColor: isActive ? "transparent" : config.color,
                  }}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Barangay Filter (Guests) */}
        {!user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <MapPin size={16} style={{ color: "var(--color-gray-400)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--color-gray-600)" }}>Barangay:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
              <button
                onClick={() => setBarangayFilter("ALL")}
                className={`snap-start px-4 py-1.5 rounded-full text-[13px] font-bold tracking-wide transition-all ${barangayFilter === "ALL" ? "shadow-md" : "hover:bg-gray-50 border border-gray-200"
                  }`}
                style={barangayFilter === "ALL" ? { background: "var(--color-primary)", color: "white" } : { background: "white", color: "var(--color-gray-500)" }}
              >
                All Barangays
              </button>
              {uniqueBarangays.map((b) => {
                const isActive = barangayFilter === b;
                return (
                  <button
                    key={b}
                    onClick={() => setBarangayFilter(b)}
                    className={`snap-start px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${isActive ? "shadow-md" : "border hover:bg-gray-50"
                      }`}
                    style={isActive ? { background: "var(--color-primary)", color: "white", borderColor: "transparent" } : { background: "white", color: "var(--color-gray-500)", borderColor: "var(--color-gray-200)" }}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <div className="flex items-center justify-between pt-2">
          {(severityFilter !== "ALL" || barangayFilter !== "ALL") && (
            <button
              onClick={() => { setSeverityFilter("ALL"); setBarangayFilter("ALL"); }}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80 uppercase tracking-widest px-3 py-1.5 rounded-lg"
              style={{ color: "var(--color-risk-high)", background: "var(--color-risk-high-bg)" }}
            >
              <X size={14} /> Clear Active Filters
            </button>
          )}
          <div className="ml-auto text-sm font-medium" style={{ color: "var(--color-gray-400)" }}>
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <div className="col-span-full bg-white p-16 text-center border border-dashed" style={{ borderRadius: "var(--radius-card)", borderColor: "var(--color-gray-200)" }}>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(44, 82, 130, 0.05)" }}>
              <FileText size={40} style={{ color: "var(--color-gray-300)" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>No reports found</h3>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--color-gray-400)" }}>
              {reports.length === 0 ? "It's all clear! No flood reports have been filed from this area yet." : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const severityConfig = getSeverityConfig(report.severity);
            const hasPhotos = report.photos && report.photos.length > 0;

            return (
              <div
                key={report.report_id}
                className="bg-white flex flex-col group overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                {/* Full Bleed Image Header */}
                {hasPhotos && (
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={report.photos[0]}
                      alt={`Report photo in ${report.user_barangay}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                    {/* Shadow gradient for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {report.photos.length > 1 && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                        <ImageIcon size={12} />
                        +{report.photos.length - 1}
                      </div>
                    )}
                    {/* Severity Badge overlayed on image */}
                    <div className="absolute bottom-4 left-4 shadow-lg">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide px-3 py-1.5"
                        style={{ background: severityConfig.bg, color: severityConfig.color, borderRadius: "var(--radius-badge)" }}
                      >
                        {severityConfig.label} Risk
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {!hasPhotos && (
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide px-3 py-1.5"
                        style={{ background: severityConfig.bg, color: severityConfig.color, borderRadius: "var(--radius-badge)" }}
                      >
                        {severityConfig.label} Risk
                      </span>
                      <span className="text-xs font-mono" style={{ color: "var(--color-gray-400)" }}>
                        #{report.report_id}
                      </span>
                    </div>
                  )}

                  {hasPhotos && (
                    <div className="flex justify-end mb-3">
                      <span className="text-xs font-mono" style={{ color: "var(--color-gray-300)" }}>
                        #{report.report_id}
                      </span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "var(--color-gray-700)" }}>
                    "{report.description}"
                  </p>

                  <div className="flex flex-col gap-2.5 pt-4 mt-auto border-t" style={{ borderColor: "var(--color-gray-100)" }}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold" style={{ color: "var(--color-primary)" }}>
                        <MapPin size={14} />
                        {report.user_barangay}
                      </div>
                      <span className="font-medium" style={{ color: "var(--color-gray-400)" }}>{formatDate(report.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs truncate" style={{ color: "var(--color-gray-500)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 shrink-0">
                        <UserIcon size={10} className="text-gray-400" />
                      </span>
                      <span className="truncate font-medium">{report.user_email}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}