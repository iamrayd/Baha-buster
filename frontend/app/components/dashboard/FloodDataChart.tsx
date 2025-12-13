// app/components/dashboard/FloodDataChart.tsx
"use client";

import { Card } from "../ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FloodDataChartProps {
  barangayName: string | null;
}

// Mock historical data for different barangays (last 7 days)
const historicalData: Record<string, any[]> = {
  "Guadalupe": [
    { date: 'Mon', rain: 15, precipitation: 18, floodDepth: 8 },
    { date: 'Tue', rain: 22, precipitation: 25, floodDepth: 12 },
    { date: 'Wed', rain: 35, precipitation: 38, floodDepth: 18 },
    { date: 'Thu', rain: 48, precipitation: 52, floodDepth: 25 },
    { date: 'Fri', rain: 62, precipitation: 68, floodDepth: 35 },
    { date: 'Sat', rain: 55, precipitation: 60, floodDepth: 30 },
    { date: 'Sun', rain: 45, precipitation: 48, floodDepth: 22 },
  ],
  "Labangon": [
    { date: 'Mon', rain: 12, precipitation: 15, floodDepth: 5 },
    { date: 'Tue', rain: 18, precipitation: 22, floodDepth: 8 },
    { date: 'Wed', rain: 25, precipitation: 28, floodDepth: 12 },
    { date: 'Thu', rain: 32, precipitation: 35, floodDepth: 15 },
    { date: 'Fri', rain: 38, precipitation: 42, floodDepth: 18 },
    { date: 'Sat', rain: 35, precipitation: 38, floodDepth: 16 },
    { date: 'Sun', rain: 28, precipitation: 32, floodDepth: 14 },
  ],
  "Mambaling": [
    { date: 'Mon', rain: 8, precipitation: 10, floodDepth: 3 },
    { date: 'Tue', rain: 12, precipitation: 14, floodDepth: 4 },
    { date: 'Wed', rain: 15, precipitation: 18, floodDepth: 6 },
    { date: 'Thu', rain: 18, precipitation: 22, floodDepth: 8 },
    { date: 'Fri', rain: 22, precipitation: 25, floodDepth: 10 },
    { date: 'Sat', rain: 20, precipitation: 23, floodDepth: 9 },
    { date: 'Sun', rain: 16, precipitation: 19, floodDepth: 7 },
  ],
  "Lahug": [
    { date: 'Mon', rain: 20, precipitation: 23, floodDepth: 10 },
    { date: 'Tue', rain: 28, precipitation: 32, floodDepth: 15 },
    { date: 'Wed', rain: 42, precipitation: 45, floodDepth: 22 },
    { date: 'Thu', rain: 55, precipitation: 60, floodDepth: 30 },
    { date: 'Fri', rain: 68, precipitation: 72, floodDepth: 38 },
    { date: 'Sat', rain: 62, precipitation: 65, floodDepth: 35 },
    { date: 'Sun', rain: 50, precipitation: 55, floodDepth: 28 },
  ],
  "Banilad": [
    { date: 'Mon', rain: 10, precipitation: 12, floodDepth: 4 },
    { date: 'Tue', rain: 14, precipitation: 16, floodDepth: 6 },
    { date: 'Wed', rain: 18, precipitation: 21, floodDepth: 8 },
    { date: 'Thu', rain: 22, precipitation: 26, floodDepth: 10 },
    { date: 'Fri', rain: 26, precipitation: 30, floodDepth: 12 },
    { date: 'Sat', rain: 24, precipitation: 28, floodDepth: 11 },
    { date: 'Sun', rain: 20, precipitation: 24, floodDepth: 9 },
  ],
};

// Custom tooltip component for better display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-bold">{entry.value}</span>
            {entry.name === 'Flood Depth' ? ' cm' : ' mm'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FloodDataChart({ barangayName }: FloodDataChartProps) {
  // Get data for selected barangay or show default message
  const data = barangayName ? historicalData[barangayName] || [] : [];

  if (!barangayName) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Flood Data Visualization</h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Click on a barangay on the map to view flood data</p>
            <p className="text-sm text-gray-500 mt-1">Historical data for the past 7 days</p>
          </div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Flood Data Visualization - {barangayName}
        </h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">No data available for {barangayName}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Flood Data Visualization - Barangay {barangayName}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last 7 Days
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Measurement', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="rain" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Rain (mm)"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="precipitation" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Precipitation (mm)"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="floodDepth" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Flood Depth (cm)"
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-4 text-xs text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Rain Measurement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Precipitation Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Flood Depth</span>
        </div>
      </div>
    </Card>
  );
}