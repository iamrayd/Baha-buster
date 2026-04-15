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
  ChevronLeft,
  ChevronRight,
  Droplets,
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

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAvatarColor(email: string): string {
  const colors = [
    "#2c5282", "#2b6cb0", "#2c7a7b", "#276749",
    "#9b2c2c", "#744210", "#553c9a", "#97266d",
    "#1a365d", "#285e61", "#22543d", "#702459",
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/* ─── Photo Gallery Component ──────────────────────────────────────────── */

function PhotoGallery({ photos, barangay }: { photos: string[]; barangay: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const fallbackHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = "none";
  };

  const renderGrid = () => {
    if (photos.length === 1) {
      return (
        <div
          className="w-full cursor-pointer overflow-hidden"
          style={{ maxHeight: 520 }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={photos[0]}
            alt={`Flood report in ${barangay}`}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
            onError={fallbackHandler}
          />
        </div>
      );
    }

    if (photos.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-0.5">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="aspect-square cursor-pointer overflow-hidden"
              onClick={() => openLightbox(i)}
            >
              <img
                src={photo}
                alt={`Flood report ${i + 1} in ${barangay}`}
                className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
                onError={fallbackHandler}
              />
            </div>
          ))}
        </div>
      );
    }

    if (photos.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-0.5" style={{ height: 420 }}>
          <div
            className="row-span-2 cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={photos[0]}
              alt={`Flood report 1 in ${barangay}`}
              className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
              onError={fallbackHandler}
            />
          </div>
          {photos.slice(1).map((photo, i) => (
            <div
              key={i + 1}
              className="cursor-pointer overflow-hidden"
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={photo}
                alt={`Flood report ${i + 2} in ${barangay}`}
                className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
                onError={fallbackHandler}
              />
            </div>
          ))}
        </div>
      );
    }

    // 4+ photos
    return (
      <div className="grid grid-cols-2 gap-0.5" style={{ height: 420 }}>
        {photos.slice(0, 4).map((photo, i) => (
          <div
            key={i}
            className="relative cursor-pointer overflow-hidden"
            onClick={() => openLightbox(i)}
          >
            <img
              src={photo}
              alt={`Flood report ${i + 1} in ${barangay}`}
              className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
              onError={fallbackHandler}
            />
            {i === 3 && photos.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">+{photos.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderGrid()}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[activeIndex]}
              alt={`Photo ${activeIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    background: i === activeIndex ? "white" : "rgba(255,255,255,0.4)",
                    transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Feed Post Component ─────────────────────────────────────────────── */

function FeedPost({ report, index }: { report: Report; index: number }) {
  const severityConfig = getSeverityConfig(report.severity);
  const hasPhotos = report.photos && report.photos.length > 0;
  const avatarColor = getAvatarColor(report.user_email);
  const initials = getInitials(report.user_email);

  return (
    <article
      className="bg-white animate-fade-in"
      style={{
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        animationDelay: `${Math.min(index * 60, 600)}ms`,
        animationFillMode: "both",
      }}
    >
      {/* ── Post Header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 select-none"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>

        {/* Name + Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[15px] truncate" style={{ color: "var(--color-gray-700)" }}>
              {report.user_email
                .split("@")[0]
                .replace(/[._-]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            {/* Severity pill inline */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 shrink-0"
              style={{
                background: severityConfig.bg,
                color: severityConfig.color,
                borderRadius: "var(--radius-badge)",
              }}
            >
              <Droplets size={10} />
              {severityConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--color-gray-500)" }}>
              <MapPin size={12} />
              <span>{report.user_barangay}</span>
            </div>
            <span className="text-xs" style={{ color: "var(--color-gray-300)" }}>·</span>
            <span
              className="text-xs cursor-default"
              style={{ color: "var(--color-gray-400)" }}
              title={formatFullDate(report.created_at)}
            >
              {formatRelativeTime(report.created_at)}
            </span>
          </div>
        </div>

        {/* Report ID */}
        <span
          className="text-[11px] font-mono shrink-0 mt-1"
          style={{ color: "var(--color-gray-300)" }}
        >
          #{report.report_id}
        </span>
      </div>

      {/* ── Post Body (Description) ─────────────────────────────────── */}
      <div className="px-5 pb-3">
        <p
          className="text-[15px] leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--color-gray-700)" }}
        >
          {report.description}
        </p>
      </div>

      {/* ── Photo Section ───────────────────────────────────────────── */}
      {hasPhotos && (
        <div className="border-t border-b" style={{ borderColor: "var(--color-gray-100)" }}>
          <PhotoGallery photos={report.photos} barangay={report.user_barangay} />
        </div>
      )}

      {/* ── Post Footer ─────────────────────────────────────────────── */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-gray-400)" }}>
          <Calendar size={13} />
          <span>{formatFullDate(report.created_at)}</span>
        </div>
        {hasPhotos && (
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-gray-400)" }}>
            <ImageIcon size={13} />
            <span>{report.photos.length} photo{report.photos.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

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

  // Sort newest first
  const sortedReports = [...filteredReports].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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
    <div className="max-w-2xl mx-auto space-y-4">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        className="bg-white px-6 py-5"
        style={{
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-gray-700)" }}>
              Flood Reports
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-gray-400)" }}>
              {user ? `Reports from ${user.barangay}` : "All reports across Cebu City"}
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(44, 82, 130, 0.08)" }}
          >
            <FileText size={22} style={{ color: "var(--color-primary)" }} />
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="mt-4 pt-4 flex items-center gap-6 border-t"
          style={{ borderColor: "var(--color-gray-100)" }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>
              {reports.length}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-gray-400)" }}>
              Total
            </p>
          </div>
          {["high", "moderate", "low"].map((level) => {
            const config = getSeverityConfig(level);
            const count = reports.filter((r) => {
              const s = r.severity.toLowerCase();
              if (level === "high") return s === "high" || s === "waist" || s === "critical";
              if (level === "moderate") return s === "moderate" || s === "knee";
              return s === "low" || s === "ankle";
            }).length;
            return (
              <div key={level} className="text-center">
                <p className="text-2xl font-bold" style={{ color: config.color }}>
                  {count}
                </p>
                <p
                  className="text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: config.color, opacity: 0.7 }}
                >
                  {level === "high" ? "High" : level === "moderate" ? "Moderate" : "Low"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Guest Notice ──────────────────────────────────────────── */}
      {!user && (
        <div
          className="flex items-start gap-3 px-5 py-4 text-sm"
          style={{
            background: "rgba(44, 82, 130, 0.06)",
            color: "var(--color-primary)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5 opacity-70" />
          <p>
            You are viewing all barangay reports.{" "}
            <a href="/login" className="font-semibold underline">Sign in</a>{" "}
            to see reports specific to your barangay.
          </p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────── */}
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

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div
        className="bg-white px-5 py-4 space-y-3"
        style={{
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Severity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={14} style={{ color: "var(--color-gray-400)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--color-gray-500)" }}>Severity</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSeverityFilter("ALL")}
              className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide transition-all whitespace-nowrap"
              style={
                severityFilter === "ALL"
                  ? { background: "var(--color-primary)", color: "white", boxShadow: "0 2px 6px rgba(44,82,130,0.3)" }
                  : { background: "var(--color-gray-50)", color: "var(--color-gray-500)" }
              }
            >
              All
            </button>
            {uniqueSeverities.map((s) => {
              const isActive = severityFilter === s;
              const config = getSeverityConfig(s);
              return (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: isActive ? config.color : "var(--color-gray-50)",
                    color: isActive ? "white" : config.color,
                    boxShadow: isActive ? `0 2px 6px ${config.color}40` : "none",
                  }}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Barangay (Guests) */}
        {!user && uniqueBarangays.length > 1 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <MapPin size={14} style={{ color: "var(--color-gray-400)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--color-gray-500)" }}>Barangay</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setBarangayFilter("ALL")}
                className="px-3 py-1 rounded-full text-[12px] font-bold tracking-wide transition-all whitespace-nowrap"
                style={
                  barangayFilter === "ALL"
                    ? { background: "var(--color-primary)", color: "white", boxShadow: "0 2px 6px rgba(44,82,130,0.3)" }
                    : { background: "var(--color-gray-50)", color: "var(--color-gray-500)" }
                }
              >
                All
              </button>
              {uniqueBarangays.map((b) => {
                const isActive = barangayFilter === b;
                return (
                  <button
                    key={b}
                    onClick={() => setBarangayFilter(b)}
                    className="px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap transition-all"
                    style={
                      isActive
                        ? { background: "var(--color-primary)", color: "white", boxShadow: "0 2px 6px rgba(44,82,130,0.3)" }
                        : { background: "var(--color-gray-50)", color: "var(--color-gray-500)" }
                    }
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter / Count */}
        <div className="flex items-center justify-between pt-1">
          {(severityFilter !== "ALL" || barangayFilter !== "ALL") && (
            <button
              onClick={() => { setSeverityFilter("ALL"); setBarangayFilter("ALL"); }}
              className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:opacity-80 uppercase tracking-wider px-2.5 py-1 rounded-lg"
              style={{ color: "var(--color-risk-high)", background: "var(--color-risk-high-bg)" }}
            >
              <X size={12} /> Clear Filters
            </button>
          )}
          <span className="ml-auto text-[12px] font-medium" style={{ color: "var(--color-gray-400)" }}>
            {filteredReports.length} of {reports.length} reports
          </span>
        </div>
      </div>

      {/* ── Feed ──────────────────────────────────────────────────── */}
      <div className="space-y-4 pb-8">
        {sortedReports.length === 0 ? (
          <div
            className="bg-white p-16 text-center"
            style={{
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(44, 82, 130, 0.05)" }}
            >
              <FileText size={40} style={{ color: "var(--color-gray-300)" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>
              No reports found
            </h3>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--color-gray-400)" }}>
              {reports.length === 0
                ? "It's all clear! No flood reports have been filed from this area yet."
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          sortedReports.map((report, i) => (
            <FeedPost key={report.report_id} report={report} index={i} />
          ))
        )}
      </div>
    </div>
  );
}