"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import QuickStats from "@/src/features/dashboard/QuickStats";
import RealTimeAlerts from "@/src/features/alerts/RealTimeAlerts";
import FloodDataChart from "@/src/features/dashboard/FloodDataChart";
import { BarangayFloodData, RiskLevel } from "@/src/types/global";
import { fetchAllForecasts } from "@/src/services/api";
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
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [user, setUser] = useState<UserData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Check if user is logged in - with debugging
    console.log("🔍 Dashboard: Checking authentication...");
    
    const userData = localStorage.getItem("user_data");
    console.log("📦 localStorage user_data:", userData ? "EXISTS" : "NULL");
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("✅ Parsed user data:", parsed);
        setUser(parsed);
      } catch (e) {
        console.error("❌ Error parsing user data:", e);
      }
    } else {
      console.log("ℹ️ No user logged in");
    }
    
    setIsCheckingAuth(false);
  }, []);

  // Re-check auth when component becomes visible (e.g., after navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Page became visible, re-checking auth...");
        const userData = localStorage.getItem("user_data");
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            console.log("✅ User still logged in:", parsed.name);
          } catch (e) {
            console.error("❌ Error re-parsing user data:", e);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }

      try {
        if (!data.length) setStatusMessage("Connecting to server...");
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
    const interval = setInterval(fetchData, 300000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_data"); // clear user session
    setUser(null); // update UI
    window.location.href = "/login"; // redirect
  };


  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gray-50">
        <div className="">
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

            {/* Loading State */}
            {loading && data.length === 0 && (
              <div className="mt-4 p-4 w-full bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 animate-pulse sm:order-last sm:col-span-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Error State */}
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <LeafletMap
                data={data}
                onBarangayClick={setSelectedBarangay}
                selectedBarangay={selectedBarangay}
                riskFilter={riskFilter}
                setRiskFilter={setRiskFilter}
              />
              <FloodDataChart barangayName={selectedBarangay} data={data} />
              <QuickStats data={data} loading={loading} />
            </div>
            <div className="xl:col-span-1">
              <RealTimeAlerts data={data} loading={loading} />
            </div>
          </div>
        </div>
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