"use client";

import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/Card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { BarangayFloodData } from "@/src/types/global";

interface FloodDataChartProps {
  barangayName: string | null;
  data: BarangayFloodData[];
}

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color: string;
  payload: {
    date: string;
    predicted_flood_depth_cm: number;
    flood_probability_percent: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-blue-100 rounded-xl shadow-xl text-sm">
        <p className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
          {label ? formatDate(label) : ""} Forecast
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-gray-900">
                {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
                {entry.name === "Flood Depth" ? " cm" : "%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function FloodDataChart({ barangayName, data }: FloodDataChartProps) {
  const [forecastDays, setForecastDays] = useState<1 | 2 | 3>(3);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const selectedBarangayData = barangayName
    ? data.find((b) => b.barangay.toUpperCase() === barangayName.toUpperCase())
    : null;

  const chartData = selectedBarangayData
    ? selectedBarangayData.forecasts.slice(0, forecastDays).map((f) => ({
        date: f.date,
        predicted_flood_depth_cm: f.predicted_flood_depth_cm,
        flood_probability_percent: f.flood_probability_percent,
      }))
    : [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (!isMounted) return <Card><div className="h-80 bg-gray-50 rounded-lg animate-pulse" /></Card>;

  if (!barangayName) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecast Visualization</h2>
        <div className="h-80 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-3 opacity-50">🗺️</div>
          <p className="text-gray-900 font-medium">Select a Barangay</p>
          <p className="text-sm text-gray-500">Click on the map to view flood risks</p>
        </div>
      </Card>
    );
  }

  if (!selectedBarangayData) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{barangayName} Forecast</h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No forecast data available.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{barangayName}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-white
              ${selectedBarangayData.summary.overall_risk_assessment === "HIGH" ? "bg-red-500" :
                selectedBarangayData.summary.overall_risk_assessment === "MEDIUM" ? "bg-orange-500" : "bg-blue-500"}`}>
              {selectedBarangayData.summary.overall_risk_assessment} RISK
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">3-Day Flood Depth & Probability Forecast</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {([1, 2, 3] as const).map((day) => (
            <button
              key={day}
              onClick={() => setForecastDays(day)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                forecastDays === day ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {day} Day{day > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" stroke="#3B82F6" fontSize={11} tickLine={false} axisLine={false}
              label={{ value: "Depth (cm)", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#3B82F6", fontSize: 11, fontWeight: 600 } }}
              domain={[0, (dataMax: number) => Math.max(dataMax * 1.5, 50)]}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" fontSize={11} unit="%" tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#9ca3af", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
            <Area yAxisId="left" type="monotone" dataKey="predicted_flood_depth_cm" name="Flood Depth" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDepth)" animationDuration={1500} />
            <Area yAxisId="right" type="monotone" dataKey="flood_probability_percent" name="Probability" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorProb)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}