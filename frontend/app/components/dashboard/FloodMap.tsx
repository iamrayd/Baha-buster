"use client";

import { useState } from "react";
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
  TooltipProps,
} from "recharts";
import { BarangayFloodData } from "@/app/types";

interface FloodDataChartProps {
  barangayName: string | null;
  data: BarangayFloodData[];
}

// Custom Tooltip Types
type ValueType = number | string | Array<number | string>;
type NameType = string | number;

export default function FloodDataChart({
  barangayName,
  data,
}: FloodDataChartProps) {
  // State to control the forecast range (1, 2, or 3 days)
  const [forecastDays, setForecastDays] = useState<1 | 2 | 3>(3);

  // 1. Find the specific barangay data from the full API response
  const selectedBarangayData = barangayName
    ? data.find(
        (b) => b.barangay.toLowerCase() === barangayName.toLowerCase()
      )
    : null;

  // 2. Prepare chart data based on the selected range (slice the forecast array)
  // If we want "2 Days", we take the first 2 items from the forecast array
  const chartData = selectedBarangayData
    ? selectedBarangayData.forecasts.slice(0, forecastDays)
    : [];

  // Helper to format dates (e.g., "2025-12-15" -> "Dec 15")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // --- Render: No Barangay Selected State ---
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

  // --- Render: No Data Found State ---
  if (!selectedBarangayData || chartData.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {barangayName} Forecast
        </h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No forecast data available for {barangayName}.
          </p>
        </div>
      </Card>
    );
  }

  // --- Custom Tooltip Component ---
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-xl text-sm">
          <p className="font-bold text-gray-800 mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">
                {entry.value}
                {entry.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Main Render ---
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

        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setForecastDays(day as 1 | 2 | 3)}
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
            {/* Left Axis: Flood Depth (cm) */}
            <YAxis
              yAxisId="left"
              stroke="#ef4444"
              fontSize={12}
              label={{
                value: "Depth (cm)",
                angle: -90,
                position: "insideLeft",
                fill: "#ef4444",
                fontSize: 12,
              }}
            />
            {/* Right Axis: Probability (%) */}
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
              unit=" cm"
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
              unit="%"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}