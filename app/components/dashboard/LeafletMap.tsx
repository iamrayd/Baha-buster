"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarangayFloodData, RiskLevel } from "@/app/types";
import { BARANGAY_BOUNDARIES } from "@/app/data/barangayBoundaries";


if (typeof window !== "undefined") {
  // @ts-expect-error - _getIconUrl is internal
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

const RISK_COLORS: Record<string, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#3B82F6",
  DEFAULT: "#9CA3AF",
};

const LEGEND_FILTERS = [
  { id: "ALL", label: "Show All", bg: "bg-gray-500", border: "border-gray-600", activeTheme: "bg-gray-100 font-bold text-gray-900" },
  { id: "HIGH", label: "High Risk", bg: "bg-red-500", border: "border-red-600", activeTheme: "bg-red-50 font-bold text-red-800" },
  { id: "MEDIUM", label: "Medium Risk", bg: "bg-orange-500", border: "border-orange-600", activeTheme: "bg-orange-50 font-bold text-orange-800" },
  { id: "LOW", label: "Low Risk", bg: "bg-blue-500", border: "border-blue-600", activeTheme: "bg-blue-50 font-bold text-blue-800" },
] as const;

interface LeafletMapProps {
  data: BarangayFloodData[];
  onBarangayClick: (barangay: string) => void;
  selectedBarangay: string | null;
  riskFilter: RiskLevel | "ALL";
  setRiskFilter: (filter: RiskLevel | "ALL") => void;
}

function MapBounds() {
  const map = useMap();
  useEffect(() => { map.setView(CEBU_CENTER, 13); }, [map]);
  return null;
}

export default function LeafletMap({
  data,
  onBarangayClick,
  selectedBarangay,
  riskFilter,
  setRiskFilter,
}: LeafletMapProps) {

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-gray-200 relative">
      <MapContainer
        center={CEBU_CENTER}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapBounds />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(BARANGAY_BOUNDARIES).map(([barangay, coordinates]) => {
          const barangayData = data.find(
            (d) => d.barangay.toUpperCase() === barangay.toUpperCase()
          );
          
          const risk = barangayData?.summary.overall_risk_assessment;

          if (riskFilter !== "ALL" && risk !== riskFilter) return null;

          const color = RISK_COLORS[risk || ""] || RISK_COLORS.DEFAULT;
          const isSelected = selectedBarangay === barangay;

          const defaultStyle = {
            color: color,
            fillColor: color,
            fillOpacity: barangayData ? 0.6 : 0.3,
            weight: isSelected ? 3 : 1,
          };

          return (
            <Polygon
              key={barangay}
              positions={coordinates as [number, number][]}
              pathOptions={defaultStyle}
              eventHandlers={{
                click: () => onBarangayClick(barangay),
                mouseover: (e) => e.target.setStyle({ weight: 3, fillOpacity: 0.8 }),
                mouseout: (e) => e.target.setStyle(defaultStyle),
              }}
            />
          );
        })}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000] border border-gray-200">
        <div className="font-bold text-gray-700 mb-2 border-b pb-1">Legend</div>
        <div className="space-y-1">
          {LEGEND_FILTERS.map(({ id, label, bg, border, activeTheme }) => (
            <button
              key={id}
              onClick={() => setRiskFilter(id as RiskLevel | "ALL")}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
                riskFilter === id ? activeTheme : "hover:bg-gray-50"
              }`}
            >
              <div className={`w-3 h-3 rounded border ${bg} ${border}`}></div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}