"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarangayFloodData, RiskLevel } from "@/app/types";
import { BARANGAY_BOUNDARIES } from "@/app/data/barangayBoundaries";

interface LeafletMapProps {
  data: BarangayFloodData[];
  onBarangayClick: (barangay: string) => void;
  selectedBarangay: string | null;
  riskFilter: RiskLevel | "ALL";
  setRiskFilter: (filter: RiskLevel | "ALL") => void;
}

const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setView(CEBU_CENTER, 13);
  }, [map]);
  return null;
}

export default function LeafletMap({
  data,
  onBarangayClick,
  selectedBarangay,
  riskFilter,
  setRiskFilter,
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      // @ts-expect-error - _getIconUrl is internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  const getColor = (risk?: RiskLevel) => {
    if (risk === "HIGH") return "#EF4444"; // Red
    if (risk === "MEDIUM") return "#F59E0B"; // Orange
    if (risk === "LOW") return "#3B82F6"; // Blue
    return "#9CA3AF"; // Gray/Default
  };

  if (!isMounted) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

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
          // 1. Find Data
          const barangayData = data.find(
            (d) => d.barangay.toUpperCase() === barangay.toUpperCase()
          );
          
          const risk = barangayData?.summary.overall_risk_assessment;

          // 2. APPLY FILTER LOGIC
          // If a filter is selected, and this barangay doesn't match, HIDE IT.
          if (riskFilter !== "ALL") {
            // Hide if no data, or if risk doesn't match filter
            if (!risk || risk !== riskFilter) {
              return null;
            }
          }

          // 3. Render Polygon
          return (
            <Polygon
              key={barangay}
              positions={coordinates}
              pathOptions={{
                color: getColor(risk),
                fillColor: getColor(risk),
                fillOpacity: barangayData ? 0.6 : 0.3,
                weight: selectedBarangay === barangay ? 3 : 1,
              }}
              eventHandlers={{
                click: () => onBarangayClick(barangay),
                mouseover: (e) => e.target.setStyle({ weight: 3, fillOpacity: 0.8 }),
                mouseout: (e) =>
                  e.target.setStyle({
                    weight: selectedBarangay === barangay ? 3 : 1,
                    fillOpacity: barangayData ? 0.6 : 0.3,
                  }),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Interactive Legend / Filter Control */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000] border border-gray-200">
        <div className="font-bold text-gray-700 mb-2 border-b pb-1">Legend</div>
        <div className="space-y-1">
          
          <button
            onClick={() => setRiskFilter("ALL")}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
              riskFilter === "ALL" ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-3 h-3 bg-gray-500 rounded border border-gray-600"></div>
            <span>Show All</span>
          </button>

          <button
            onClick={() => setRiskFilter("HIGH")}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
              riskFilter === "HIGH" ? "bg-red-50 font-bold text-red-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
            <span>High Risk</span>
          </button>

          <button
            onClick={() => setRiskFilter("MEDIUM")}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
              riskFilter === "MEDIUM" ? "bg-orange-50 font-bold text-orange-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-3 h-3 bg-orange-500 rounded border border-orange-600"></div>
            <span>Medium Risk</span>
          </button>

          <button
            onClick={() => setRiskFilter("LOW")}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
              riskFilter === "LOW" ? "bg-blue-50 font-bold text-blue-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-3 h-3 bg-blue-500 rounded border border-blue-600"></div>
            <span>Low Risk</span>
          </button>

        </div>
      </div>
    </div>
  );
}