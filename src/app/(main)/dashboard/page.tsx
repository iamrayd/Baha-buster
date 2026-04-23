"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import QuickStats from "@/src/features/dashboard/QuickStats";
import RealTimeAlerts from "@/src/features/alerts/RealTimeAlerts";
import FloodDataChart from "@/src/features/dashboard/FloodDataChart";
import { BarangayFloodData, RiskLevel } from "@/src/types/global";
import { fetchAllForecasts, fetchAllSOSAlerts, SOSAlert } from "@/src/services/api";
import { GoogleMapHandle } from "@/src/features/flood-map/components/GoogleMap";
import { useAuth } from "@/src/contexts/AuthContext";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

const FloodGoogleMap = dynamic(
  () => import("@/src/features/flood-map/components/GoogleMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-gray-100">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <span className="text-sm font-medium text-gray-500">Initializing Map Environment...</span>
      </div>
    ),
  }
);

const CACHE_KEY = "baha_buster_data_v1";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading current conditions...");
  const [error, setError] = useState<string | null>(null);

  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  const mapRef = useRef<GoogleMapHandle>(null);

  // Set initial barangay from user profile
  useEffect(() => {
    if (user?.barangay) {
      setSelectedBarangay(user.barangay);
    }
  }, [user]);

  // Initial zoom is now handled inside GoogleMap components onLoad

  // Fetch data with polling
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      // 1. Try Cache First
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setData(parsed);
            setLoading(false);
          }
        } catch {
          // Silent catch for corrupted cache
        }
      }

      // 2. Fetch Fresh Data
      try {
        if (data.length === 0) setStatusMessage("Connecting to server...");

        const [jsonData, sosData] = await Promise.all([
          fetchAllForecasts(),
          fetchAllSOSAlerts()
        ]);

        if (isMounted) {
          setData(jsonData);
          setSosAlerts(sosData);
          setLoading(false);
          setError(null); // Clear errors on success
          localStorage.setItem(CACHE_KEY, JSON.stringify(jsonData));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted && data.length === 0) {
          setError("Server is currently unreachable. Please wait a moment and retry.");
          setLoading(false);
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10_000); // 10 seconds for real-time SOS

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAlertBarangayClick = useCallback((barangay: string) => {
    setSelectedBarangay(barangay);
    mapRef.current?.flyToBarangay(barangay);
  }, []);

  const handleMapBarangayClick = useCallback((barangay: string) => {
    setSelectedBarangay(barangay);
  }, []);

  return (
    <div className="space-y-5 w-full pb-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {user ? `${getGreeting()}, ${user.name.split(" ")[0]}!` : `${getGreeting()}!`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of current flood risks and disaster response activities in Cebu City.
          </p>
        </div>
      </div>

      {/* ── Status Banners ──────────────────────────────────────────────── */}
      {loading && data.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl flex items-center gap-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {error && data.length === 0 && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* ── Quick Stats ─────────────────────────────────────────────────── */}
      <QuickStats data={data} sosAlerts={sosAlerts} loading={loading} />

      {/* ── Full-Width Map ──────────────────────────────────────────────── */}
      {/* FIXED: Added 'relative z-0 isolate' to prevent map controls from overlapping the sidebar */}
      <div className="relative z-0 isolate bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <FloodGoogleMap
          ref={mapRef}
          data={data}
          onBarangayClick={handleMapBarangayClick}
          selectedBarangay={selectedBarangay}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
          sosAlerts={sosAlerts}
        />
      </div>

      {/* ── Chart + Alerts Side by Side ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
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

    </div>
  );
}