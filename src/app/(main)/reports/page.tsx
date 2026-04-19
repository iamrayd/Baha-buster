"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Droplets,
  Clock
} from "lucide-react";
import {
  getReportsByBarangay,
  Report,
  User,
} from "@/src/services/api";

/* ───────────────── CONFIG ───────────────── */

const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  low: { label: "Low", bg: "var(--color-risk-low-bg, #eff6ff)", color: "var(--color-risk-low, #2563eb)" },
  ankle: { label: "Ankle Deep", bg: "var(--color-risk-low-bg, #eff6ff)", color: "var(--color-risk-low, #2563eb)" },
  knee: { label: "Knee Deep", bg: "var(--color-risk-medium-bg, #fefce8)", color: "var(--color-risk-medium, #854d0e)" },
  waist: { label: "Waist Deep", bg: "var(--color-risk-high-bg, #fff1f2)", color: "var(--color-risk-high, #9f1239)" },
  moderate: { label: "Moderate", bg: "var(--color-risk-medium-bg, #fefce8)", color: "var(--color-risk-medium, #854d0e)" },
  high: { label: "High", bg: "var(--color-risk-high-bg, #fff1f2)", color: "var(--color-risk-high, #9f1239)" },
  critical: { label: "Critical", bg: "#faf5ff", color: "#6b46c1" },
};

function getSeverityConfig(severity?: string) {
  if (!severity) return SEVERITY_CONFIG.low;
  return SEVERITY_CONFIG[severity.toLowerCase()] ?? SEVERITY_CONFIG.low;
}

/* ───────────────── UTILITIES ───────────────── */

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;

  return date.toLocaleDateString();
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAvatarColor(email: string): string {
  const colors = ["#2c5282", "#2b6cb0", "#2c7a7b", "#276749", "#9b2c2c", "#744210", "#553c9a", "#97266d"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

/* ───────────────── PHOTO GALLERY (RESPONSIVE) ───────────────── */

function PhotoGallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!photos?.length) return null;

  // Dynamic grid based on photo count for better aesthetics
  const gridLayout =
    photos.length === 1 ? "grid-cols-1" :
      photos.length === 2 ? "grid-cols-2 aspect-[2/1]" :
        "grid-cols-2 aspect-[4/3]";

  return (
    <>
      <div className={`grid gap-1 mt-3 rounded-lg overflow-hidden ${gridLayout}`}>
        {photos.slice(0, 4).map((p, i) => (
          <div
            key={i}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="cursor-pointer relative overflow-hidden group"
          >
            <img
              src={p}
              alt={`Report photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            {/* Overlay for +X photos if more than 4 */}
            {i === 3 && photos.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-lg">
                +{photos.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] backdrop-blur-sm"
          onClick={() => setOpen(false)} // Close when clicking background
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-black/50"
          >
            <X size={24} />
          </button>

          <img
            src={photos[index]}
            alt="Expanded view"
            className="max-w-full max-h-[85vh] px-4 object-contain select-none"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i => (i === 0 ? photos.length - 1 : i - 1));
                }}
                className="absolute left-2 sm:left-6 text-white/70 hover:text-white p-3 rounded-full bg-black/50 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i => (i === photos.length - 1 ? 0 : i + 1));
                }}
                className="absolute right-2 sm:right-6 text-white/70 hover:text-white p-3 rounded-full bg-black/50 transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ───────────────── FEED POST ───────────────── */

function FeedPost({ report }: { report: Report }) {
  const severity = getSeverityConfig(report.severity);
  const avatar = getAvatarColor(report.user_email);
  const username = report.user_email.split("@")[0];

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex gap-3 px-4 pt-4 pb-2">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
          style={{ background: avatar }}
        >
          {getInitials(report.user_email)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-sm truncate">{username}</span>
            </div>
            <span
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: severity.bg, color: severity.color }}
            >
              {severity.label}
            </span>
          </div>

          <div className="flex items-center text-xs gap-1.5 text-gray-500 mt-0.5">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="truncate">{report.user_barangay}</span>
            <span className="opacity-50">•</span>
            <span className="whitespace-nowrap">{formatRelativeTime(report.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {report.description}
        </p>
        <PhotoGallery photos={report.photos} />
      </div>

      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50 text-xs text-gray-400 flex justify-between items-center">
        <span>{formatFullDate(report.created_at)}</span>
        {report.photos?.length > 0 && (
          <span className="flex items-center gap-1">
            <Droplets size={12} /> {report.photos.length} Media
          </span>
        )}
      </div>
    </article>
  );
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load local user metadata to fetch scoped reports
    const rawData = localStorage.getItem("user_data");
    let activeUser: User | null = null;
    
    if (rawData) {
      try {
        activeUser = JSON.parse(rawData);
        setUser(activeUser);
      } catch (err) {
        setLoading(false);
        return;
      }
    }

    // Only load reports for the user's specific barangay
    if (activeUser?.barangay) {
      getReportsByBarangay(activeUser.barangay).then((data) => {
        setReports(data || []);
        setLoading(false);
      }).catch(() => {
        setLoading(false); // Handle potential API errors gracefully
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Calculate quick stats for the dashboard header
  const criticalCount = reports.filter(r => ["critical", "high"].includes(r.severity?.toLowerCase())).length;
  const recentCount = reports.filter(r => (new Date().getTime() - new Date(r.created_at).getTime()) < 86400000).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* HEADER DASHBOARD */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Flood Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Live monitoring for Cebu City</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 flex-shrink-0 flex items-center justify-center rounded-xl text-blue-600">
            <FileText size={24} />
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
          <div className="flex flex-col items-center sm:items-start">
            {loading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            )}
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
              <FileText size={12} /> Total
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            {loading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            )}
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
              <AlertTriangle size={12} /> High/Critical
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            {loading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-blue-600">{recentCount}</p>
            )}
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
              <Clock size={12} /> Last 24h
            </p>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="space-y-4 pb-12">
        {loading ? (
          // Skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="flex gap-3 px-4 pt-4 pb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="px-4 pb-4 mt-2 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="h-32 w-full bg-gray-200 rounded mt-3" />
              </div>
            </div>
          ))
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            <Droplets className="mx-auto mb-3 opacity-50" size={32} />
            <p>No flood reports at this time.</p>
          </div>
        ) : (
          reports.map((r) => (
            <FeedPost key={r.report_id} report={r} />
          ))
        )}
      </div>
    </div>
  );
}