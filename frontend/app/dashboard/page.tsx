// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import QuickStats from "@/app/components/dashboard/QuickStats";
import RealTimeAlerts from "@/app/components/dashboard/RealTimeAlerts";
import FloodMap from "@/app/components/dashboard/FloodMap";
import { BarangayFloodData } from "@/app/types";

export default function DashboardPage() {
  const [data, setData] = useState<BarangayFloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        // NOTE: Adjust endpoint if your team uses /api/forecasts or similar
        const res = await fetch(`${apiUrl}/predict`);

        if (!res.ok) {
          throw new Error("Failed to connect to backend API");
        }

        const jsonData: BarangayFloodData[] = await res.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("System Offline: Using cached historical data");
        setLoading(false);
        // Optional: Set mock data here if fetch fails so the UI isn't empty
      }
    }

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of current flood risks and disaster response activities in Cebu City.
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
            Warning: {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* We pass the fetched data down to the components */}
          <FloodMap data={data} loading={loading} />
          <QuickStats data={data} loading={loading} />
        </div>
        <div className="xl:col-span-1">
          <RealTimeAlerts data={data} loading={loading} />
        </div>
      </div>
    </div>
  );
}