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
      <div
        className="p-4 border text-sm"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--color-gray-200)",
          borderRadius: "var(--radius-input)",
          boxShadow: "var(--shadow-elevated)",
        }}
      >
        <p className="font-bold mb-3 pb-2" style={{ color: "var(--color-gray-700)", borderBottom: "1px solid var(--color-gray-100)" }}>
          {label ? formatDate(label) : ""} Forecast
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="font-medium" style={{ color: "var(--color-gray-600)" }}>{entry.name}</span>
              </div>
              <span className="font-bold" style={{ color: "var(--color-gray-700)" }}>
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

  const chartData = selectedBarangayData?.predictions
    ? selectedBarangayData.predictions.slice(0, forecastDays).map((p) => {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + (p.day - 1));
        return {
          date: forecastDate.toISOString(),
          predicted_flood_depth_cm: p.predicted_depth_cm,
          flood_probability_percent: p.flood_probability * 100,
        };
      })
    : [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (!isMounted) return <Card><div className="h-80 rounded-xl animate-pulse" style={{ background: "var(--color-gray-50)" }} /></Card>;

  if (!barangayName) {
    return (
      <Card>
        <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-gray-700)" }}>Forecast Visualization</h2>
        <div
          className="h-80 flex flex-col items-center justify-center border-2 border-dashed"
          style={{ borderColor: "var(--color-gray-200)", borderRadius: "var(--radius-input)" }}
        >
          <div className="text-5xl mb-3 opacity-40">🗺️</div>
          <p className="font-semibold" style={{ color: "var(--color-gray-700)" }}>Select a Barangay</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>Click on the map to view flood risks</p>
        </div>
      </Card>
    );
  }

  if (!selectedBarangayData) {
    return (
      <Card>
        <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-gray-700)" }}>{barangayName} Forecast</h2>
        <div className="h-80 flex items-center justify-center" style={{ background: "var(--color-gray-50)", borderRadius: "var(--radius-input)" }}>
          <p style={{ color: "var(--color-gray-500)" }}>No forecast data available.</p>
        </div>
      </Card>
    );
  }

  const riskLevel = selectedBarangayData.predictions?.[0]?.risk_level || "LOW";

  const riskStyles: Record<string, { bg: string; color: string }> = {
    HIGH:   { bg: "var(--color-risk-high)",   color: "#ffffff" },
    MEDIUM: { bg: "var(--color-risk-medium)", color: "#ffffff" },
    LOW:    { bg: "var(--color-risk-low)",    color: "#ffffff" },
  };

  const rs = riskStyles[riskLevel];

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-gray-700)" }}>{barangayName}</h2>
            <span
              className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              style={{ background: rs.bg, color: rs.color, borderRadius: "var(--radius-badge)" }}
            >
              {riskLevel} RISK
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--color-gray-400)" }}>{forecastDays}-Day Flood Depth & Probability Forecast</p>
        </div>
        <div className="flex p-1 rounded-lg" style={{ background: "var(--color-gray-100)" }}>
          {([1, 2, 3] as const).map((day) => (
            <button
              key={day}
              onClick={() => setForecastDays(day)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all"
              style={{
                background: forecastDays === day ? "#ffffff" : "transparent",
                color: forecastDays === day ? "var(--color-primary)" : "var(--color-gray-500)",
                boxShadow: forecastDays === day ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#a0aec0" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" stroke="#3B82F6" fontSize={11} tickLine={false} axisLine={false}
              label={{ value: "Depth (cm)", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#3B82F6", fontSize: 11, fontWeight: 600 } }}
              domain={[0, (dataMax: number) => Math.max(dataMax * 1.5, 50)]}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" fontSize={11} unit="%" tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#a0aec0", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
            <Area yAxisId="left" type="monotone" dataKey="predicted_flood_depth_cm" name="Flood Depth" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDepth)" animationDuration={1500} />
            <Area yAxisId="right" type="monotone" dataKey="flood_probability_percent" name="Probability" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorProb)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}