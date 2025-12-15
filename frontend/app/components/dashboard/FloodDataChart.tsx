"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Forecast } from "@/app/types";

interface FloodDataChartProps {
  barangayName: string | null;
}

// 1. Define specific types for the Tooltip payload to fix "any" errors
interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color: string;
  unit?: string;
}

// 2. Manual interface to replace the generic TooltipProps
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-gray-800 mb-2">
          {label ? formatDate(label) : ""}
        </p>
        {/* Now 'entry' is typed as TooltipPayloadItem, so no "implicit any" error */}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">
              {entry.value}
              {entry.name === "Flood Depth" ? " cm" : "%"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FloodDataChart({ barangayName }: FloodDataChartProps) {
  const [forecastDays, setForecastDays] = useState<1 | 2 | 3>(3);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SPECIFIC_API_URL =
    process.env.NEXT_PUBLIC_API_SPECIFIC_BARANGAY_URL ||
    "https://bahabuster-backend.onrender.com/forecast";

  useEffect(() => {
    if (!barangayName) {
      setForecastData([]);
      return;
    }

    async function fetchSpecificData() {
      setLoading(true);
      setError(null);
      try {
        const url = `${SPECIFIC_API_URL}?barangay=${barangayName?.toUpperCase()}`;
        console.log("Fetching chart data:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch forecast");

        const data: Forecast[] = await res.json();
        setForecastData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load detailed forecast.");
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecificData();
  }, [barangayName, SPECIFIC_API_URL]);

  const chartData = forecastData.slice(0, forecastDays).map((forecast) => ({
    date: forecast.date,
    predicted_flood_depth_cm: forecast.predicted_flood_depth_cm,
    flood_probability_percent: forecast.flood_probability_percent,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (!barangayName) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Forecast Visualization
        </h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📍</div>
            <p className="text-gray-600 font-medium">No Area Selected</p>
            <p className="text-sm text-gray-500 mt-1">
              Click a barangay on the map to see its 3-day forecast.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {barangayName} Forecast
        </h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (forecastData.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {barangayName} Forecast
        </h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {error || `No forecast data available for ${barangayName}.`}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {barangayName} Forecast
          </h2>
          <p className="text-xs text-gray-500">
            AI-Predicted Flood Levels & Probability
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {([1, 2, 3] as const).map((day) => (
            <button
              key={day}
              onClick={() => setForecastDays(day)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                forecastDays === day
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {day} Day{day > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9ca3af"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              yAxisId="left"
              stroke="#ef4444"
              fontSize={12}
              label={{
                value: "Depth (cm)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#ef4444", fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#3b82f6"
              fontSize={12}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="predicted_flood_depth_cm"
              name="Flood Depth"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="flood_probability_percent"
              name="Probability"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}