"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  AlertCircle,
  Clock,
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

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  low:      { label: "Low",        color: "text-blue-600",   bgColor: "bg-blue-100"   },
  ankle:    { label: "Ankle Deep", color: "text-blue-600",   bgColor: "bg-blue-100"   },
  knee:     { label: "Knee Deep",  color: "text-orange-600", bgColor: "bg-orange-100" },
  waist:    { label: "Waist Deep", color: "text-red-600",    bgColor: "bg-red-100"    },
  moderate: { label: "Moderate",   color: "text-orange-600", bgColor: "bg-orange-100" },
  high:     { label: "High",       color: "text-red-600",    bgColor: "bg-red-100"    },
  critical: { label: "Critical",   color: "text-purple-600", bgColor: "bg-purple-100" },
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports, setReports]               = useState<Report[]>([]);
  const [loading, setLoading]               = useState(true);
  const [isFetchingAll, setIsFetchingAll]   = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [user, setUser]                     = useState<User | null>(null);
  const [authResolved, setAuthResolved]     = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [barangayFilter, setBarangayFilter] = useState<string>("ALL");

  // ── Resolve user from localStorage (no redirect) ──────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        // malformed data — treat as guest
      }
    }
    setAuthResolved(true);
  }, []);

  // Fetch reports if not logged in
  useEffect(() => {
    if (!authResolved) return;

    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          // Logged-in: fetch only their barangay
          const data = await getReportsByBarangay(user.barangay);
          setReports(data);
        } else {
          // Guest: fetch all barangays in parallel — may take a moment
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

  // ── Derived values ────────────────────────────────────────────────────────
  const uniqueSeverities = Array.from(
    new Set(reports.map((r) => r.severity.toLowerCase()))
  );

  const uniqueBarangays = Array.from(
    new Set(reports.map((r) => r.user_barangay))
  ).sort();

  const filteredReports = reports.filter((report) => {
    const matchesSeverity =
      severityFilter === "ALL" ||
      report.severity.toLowerCase() === severityFilter.toLowerCase();

    const matchesBarangay =
      barangayFilter === "ALL" || report.user_barangay === barangayFilter;

    return matchesSeverity && matchesBarangay;
  });

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2
            size={40}
            className="animate-spin text-blue-600 mx-auto"
          />
          <p className="text-gray-700 font-medium">Loading reports...</p>
          {isFetchingAll && (
            <p className="text-sm text-gray-400">
              Fetching reports across all barangays — this may take a moment.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {user
            ? `Showing flood reports for ${user.barangay}`
            : "Showing all flood reports across Cebu City"}
        </p>
      </div>

      {/* Guest notice */}
      {!user && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-blue-500" />
          <p>
            You are viewing all barangay reports.{" "}
            <a
              href="/login"
              className="font-semibold underline hover:text-blue-900"
            >
              Sign in
            </a>{" "}
            to see reports specific to your barangay.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900">Error loading reports</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Reports</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {reports.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Filters:</span>
        </div>

        {/* Severity */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Severities</option>
          {uniqueSeverities.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Barangay — only for guests since logged-in users see their own */}
        {!user && (
          <select
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Barangays</option>
            {uniqueBarangays.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}

        {/* Clear */}
        {(severityFilter !== "ALL" || barangayFilter !== "ALL") && (
          <button
            onClick={() => {
              setSeverityFilter("ALL");
              setBarangayFilter("ALL");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        )}

        <div className="ml-auto text-sm text-gray-500">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Report cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 text-sm">
              {reports.length === 0
                ? "No reports have been filed yet."
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const severityConfig = getSeverityConfig(report.severity);

            return (
              <div
                key={report.report_id}
                className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-5">

                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full ${severityConfig.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <AlertCircle size={20} className={severityConfig.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900">
                            Flood Report
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityConfig.color} ${severityConfig.bgColor}`}
                          >
                            {severityConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono shrink-0">
                      #{report.report_id}
                    </span>
                  </div>

                  {/* Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                          {report.photos.length} Photo
                          {report.photos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {report.photos.slice(0, 3).map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                          >
                            <img
                              src={photo}
                              alt={`Report photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {report.photos.length > 3 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{report.photos.length - 3} more photo
                          {report.photos.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{report.user_barangay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Reported {formatDate(report.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Incident: {formatDate(report.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-gray-400">By:</span>
                      <span className="font-medium text-gray-600">
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