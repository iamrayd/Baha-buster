"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import QuickStats from "@/src/features/dashboard/QuickStats";
import RealTimeAlerts from "@/src/features/alerts/RealTimeAlerts";
import FloodDataChart from "@/src/features/dashboard/FloodDataChart";
import { BarangayFloodData, RiskLevel } from "@/src/types/global";
import { fetchAllForecasts } from "@/src/services/api";
import { LeafletMapHandle } from "@/src/features/flood-map/components/LeafletMap";
import Link from "next/link";
import { LogOut } from "lucide-react";

const LeafletMap = dynamic(
  () => import("@/src/features/flood-map/components/LeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[500px] flex items-center justify-center animate-pulse"
        style={{ background: "var(--color-gray-100)", borderRadius: "var(--radius-card)" }}
      >
        <div className="text-center">
          <div
            className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "var(--color-gray-300)", borderTopColor: "var(--color-primary)" }}
          />
          <span className="text-sm font-medium" style={{ color: "var(--color-gray-500)" }}>Loading Map...</span>
        </div>
      </div>
    ),
  }
);

const CACHE_KEY = "baha_buster_data_v1";

interface UserData {
  user_id: number;
  email: string;
  name: string;
  barangay: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [user, setUser] = useState<UserData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const mapRef = useRef<LeafletMapHandle>(null);

  // Auth
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        // malformed — stay as guest
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch {
            // ignore
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed);
            setLoading(false);
          }
        } catch {
          // ignore bad cache
        }
      }

      try {
        setStatusMessage("Connecting to server...");
        const jsonData = await fetchAllForecasts();
        if (isMounted) {
          setData(jsonData);
          setLoading(false);
          localStorage.setItem(CACHE_KEY, JSON.stringify(jsonData));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted && data.length === 0) {
          setError("Server is sleeping or offline. Please wait a moment and retry.");
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  function handleAlertBarangayClick(barangay: string) {
    setSelectedBarangay(barangay);
    mapRef.current?.flyToBarangay(barangay);
  }

  function handleMapBarangayClick(barangay: string) {
    setSelectedBarangay(barangay);
  }

  return (
    <div className="space-y-6">
      {/*  Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>
            {user ? `${getGreeting()}, ${user.name.split(" ")[0]}!` : `${getGreeting()}!`}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray-500)" }}>
            Overview of current flood risks and disaster response activities in Cebu City.
          </p>
        </div>
      </div>

      {/* Loading / Error Banners  */}
      {loading && data.length === 0 && (
        <div
          className="p-4 flex items-center gap-3 text-sm animate-pulse"
          style={{
            background: "rgba(44, 82, 130, 0.08)",
            color: "var(--color-primary)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin shrink-0"
            style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
          />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {error && data.length === 0 && (
        <div
          className="p-4 text-sm"
          style={{
            background: "var(--color-risk-high-bg)",
            color: "var(--color-risk-high)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <p className="font-semibold">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs underline font-medium"
          >
            Reload Page
          </button>
        </div>
      )}

      {/* ── Quick Stats ─────────────────────────────────────────────────── */}
      <QuickStats data={data} loading={loading} />

      {/* ── Full-Width Map ──────────────────────────────────────────────── */}
      <LeafletMap
        ref={mapRef}
        data={data}
        onBarangayClick={handleMapBarangayClick}
        selectedBarangay={selectedBarangay}
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
      />

      {/* ── Chart + Alerts Side by Side ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <FloodDataChart barangayName={selectedBarangay} data={data} />
        </div>
        <div className="xl:col-span-1">
          <RealTimeAlerts
            data={data}
            loading={loading}
            onBarangayClick={handleAlertBarangayClick}
            selectedBarangay={selectedBarangay}
          />
        </div>
      </div>

      {/* ── Logout Modal ────────────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in">
          <div
            className="bg-white w-full max-w-sm p-6 animate-scale-in"
            style={{ borderRadius: "var(--radius-modal)", boxShadow: "var(--shadow-elevated)" }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>
              Confirm Logout
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--color-gray-500)" }}>
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--color-gray-500)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("user_data");
                  setUser(null);
                  window.location.href = "/login";
                }}
                className="px-5 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
                style={{ background: "var(--color-risk-high)" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}