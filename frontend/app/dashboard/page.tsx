"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // 1. Import dynamic
import Sidebar from "@/app/components/layout/Sidebar";
import QuickStats from "@/app/components/dashboard/QuickStats";
import RealTimeAlerts from "@/app/components/dashboard/RealTimeAlerts";
import FloodDataChart from "@/app/components/dashboard/FloodDataChart";
import { BarangayFloodData } from "@/app/types";

// 2. Dynamically import the Map component with SSR disabled
const LeafletMap = dynamic(
  () => import("@/app/components/dashboard/LeafletMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-gray-500 font-medium">Loading Map...</span>
      </div>
    )
  }
);

export default function DashboardPage() {
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading Dashboard...");
  const [error, setError] = useState<string | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  const API_ALL_URL = process.env.NEXT_PUBLIC_API_URL || "https://bahabuster-backend.onrender.com/forecasts/all";

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardDataWithRetry(retries = 3, delay = 3000) {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);

      for (let i = 0; i < retries; i++) {
        try {
          if (i > 0) setLoadingMessage(`Waking up server (Attempt ${i + 1}/${retries})...`);
          
          const res = await fetch(API_ALL_URL);

          if (!res.ok) throw new Error(`API Error: ${res.status}`);

          const jsonData: BarangayFloodData[] = await res.json();
          
          if (isMounted) {
            setData(jsonData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error(`Attempt ${i + 1} failed:`, err);
          if (i === retries - 1 && isMounted) {
            setError(err instanceof Error ? err.message : "Connection failed");
            setLoading(false);
          } else {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    }

    fetchDashboardDataWithRetry();
    
    const interval = setInterval(() => fetchDashboardDataWithRetry(1), 300000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [API_ALL_URL]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of current flood risks and disaster response activities in Cebu City.
            </p>
            
            {loading && !data.length && (
              <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{loadingMessage}</span>
              </div>
            )}

            {error && !loading && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                <p className="font-semibold">⚠️ Connection Error: {error}</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-xs underline hover:text-red-800">
                  Retry Connection
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Map Component */}
              <LeafletMap 
                data={data} 
                onBarangayClick={setSelectedBarangay}
                selectedBarangay={selectedBarangay}
              />
              
              {/* Chart Component */}
              <FloodDataChart barangayName={selectedBarangay} />

              <QuickStats data={data} loading={loading} />
            </div>
            
            <div className="xl:col-span-1">
              <RealTimeAlerts data={data} loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}