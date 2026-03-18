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
import { User } from "lucide-react";

const LeafletMap = dynamic(
  () => import("@/src/features/flood-map/components/LeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-gray-500 font-medium">Loading Map...</span>
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

export default function DashboardPage() {
  const [data, setData]                       = useState<BarangayFloodData[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [statusMessage, setStatusMessage]     = useState("Loading...");
  const [error, setError]                     = useState<string | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [riskFilter, setRiskFilter]           = useState<RiskLevel | "ALL">("ALL");
  const [user, setUser]                       = useState<UserData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Ref to the map so alert clicks can trigger flyTo
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

  // Zoom in on map on alert click
  function handleAlertBarangayClick(barangay: string) {
    setSelectedBarangay(barangay);
    mapRef.current?.flyToBarangay(barangay);
  }

  // Map polygon click — just select barangay
  function handleMapBarangayClick(barangay: string) {
    setSelectedBarangay(barangay);
  }

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gray-50">
        <div className="">

          {/* Header*/}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Overview of current flood risks and disaster response activities in Cebu City.
              </p>
              {user && (
                <p className="text-sm text-blue-600 mt-2">
                  Welcome back, <strong>{user.name}</strong>!
                </p>
              )}
            </div>

            <div className="flex gap-4">
              {user ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm font-medium"
                >
                  <User size={18} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors shadow-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {loading && data.length === 0 && (
              <div className="mt-4 p-4 w-full bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 animate-pulse sm:order-last sm:col-span-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>{statusMessage}</span>
              </div>
            )}

            {error && data.length === 0 && (
              <div className="mt-4 p-4 w-full bg-red-50 text-red-700 rounded-lg sm:order-last sm:col-span-2">
                <p className="font-semibold">⚠️ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs underline"
                >
                  Reload Page
                </button>
              </div>
            )}
          </div>

          {/* ── Main grid ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <LeafletMap
                ref={mapRef}
                data={data}
                onBarangayClick={handleMapBarangayClick}
                selectedBarangay={selectedBarangay}
                riskFilter={riskFilter}
                setRiskFilter={setRiskFilter}
              />
              <FloodDataChart barangayName={selectedBarangay} data={data} />
              <QuickStats data={data} loading={loading} />
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

        {/* ── Logout modal ──────────────────────────────────────────────── */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("user_data");
                    setUser(null);
                    window.location.href = "/login";
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}