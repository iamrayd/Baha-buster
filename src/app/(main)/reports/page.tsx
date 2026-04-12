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
} from "lucide-react";
import {
  getAllReports,
  getReportsByBarangay,
  Report,
  User,
} from "@/src/services/api";

const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  low:      { label: "Low",        bg: "var(--color-risk-low-bg)",    color: "var(--color-risk-low)"    },
  ankle:    { label: "Ankle Deep", bg: "var(--color-risk-low-bg)",    color: "var(--color-risk-low)"    },
  knee:     { label: "Knee Deep",  bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)" },
  waist:    { label: "Waist Deep", bg: "var(--color-risk-high-bg)",   color: "var(--color-risk-high)"   },
  moderate: { label: "Moderate",   bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)" },
  high:     { label: "High",       bg: "var(--color-risk-high-bg)",   color: "var(--color-risk-high)"   },
  critical: { label: "Critical",   bg: "#faf5ff",                     color: "#6b46c1"                  },
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
  const [reports, setReports]               = useState<Report[]>([]);
  const [loading, setLoading]               = useState(true);
  const [isFetchingAll, setIsFetchingAll]   = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [user, setUser]                     = useState<User | null>(null);
  const [authResolved, setAuthResolved]     = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [barangayFilter, setBarangayFilter] = useState<string>("ALL");

  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      try { setUser(JSON.parse(raw) as User); } catch { /* guest */ }
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: "var(--color-gray-400)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--color-gray-600)" }}>Filters:</span>
        </div>

        <select
          value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border focus:outline-none focus:ring-2"
          style={{ borderRadius: "var(--radius-input)", borderColor: "var(--color-gray-200)", background: "var(--color-card)" }}
        >
          <option value="ALL">All Severities</option>
          {uniqueSeverities.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {!user && (
          <select
            value={barangayFilter} onChange={(e) => setBarangayFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border focus:outline-none focus:ring-2"
            style={{ borderRadius: "var(--radius-input)", borderColor: "var(--color-gray-200)", background: "var(--color-card)" }}
          >
            <option value="ALL">All Barangays</option>
            {uniqueBarangays.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}

        {(severityFilter !== "ALL" || barangayFilter !== "ALL") && (
          <button
            onClick={() => { setSeverityFilter("ALL"); setBarangayFilter("ALL"); }}
            className="text-sm font-semibold transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            Clear filters
          </button>
        )}

        <div className="ml-auto text-sm" style={{ color: "var(--color-gray-500)" }}>
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Report cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-12 text-center" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
            <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--color-gray-300)" }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>No reports found</h3>
            <p className="text-sm" style={{ color: "var(--color-gray-400)" }}>
              {reports.length === 0 ? "No reports have been filed yet." : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const severityConfig = getSeverityConfig(report.severity);

            return (
              <div
                key={report.report_id}
                className="bg-white hover:shadow-md transition-shadow duration-200"
                style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: severityConfig.bg }}
                      >
                        <AlertCircle size={20} style={{ color: severityConfig.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold" style={{ color: "var(--color-gray-700)" }}>Flood Report</h3>
                          <span
                            className="text-[10px] font-bold uppercase px-2.5 py-0.5"
                            style={{ background: severityConfig.bg, color: severityConfig.color, borderRadius: "var(--radius-badge)" }}
                          >
                            {severityConfig.label}
                          </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: "var(--color-gray-500)" }}>{report.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono shrink-0" style={{ color: "var(--color-gray-400)" }}>
                      #{report.report_id}
                    </span>
                  </div>

                  {/* Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon size={14} style={{ color: "var(--color-gray-400)" }} />
                        <span className="text-xs font-semibold" style={{ color: "var(--color-gray-500)" }}>
                          {report.photos.length} Photo{report.photos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {report.photos.slice(0, 3).map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-video overflow-hidden"
                            style={{ borderRadius: "var(--radius-input)", background: "var(--color-gray-100)" }}
                          >
                            <img
                              src={photo}
                              alt={`Report photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {report.photos.length > 3 && (
                        <p className="text-xs mt-2" style={{ color: "var(--color-gray-500)" }}>
                          +{report.photos.length - 3} more photo{report.photos.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-xs pt-3 flex-wrap" style={{ color: "var(--color-gray-500)", borderTop: "1px solid var(--color-gray-100)" }}>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{report.user_barangay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Reported {formatDate(report.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <span style={{ color: "var(--color-gray-400)" }}>By:</span>
                      <span className="font-semibold" style={{ color: "var(--color-gray-600)" }}>
                        {report.user_email}
                      </span>
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