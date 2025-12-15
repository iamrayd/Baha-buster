"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarangayFloodData } from "@/app/types";
import { BARANGAY_BOUNDARIES } from "@/app/data/barangayBoundaries";

interface LeafletMapProps {
  data: BarangayFloodData[];
  onBarangayClick: (barangay: string) => void;
  selectedBarangay: string | null;
}

// Cebu City coordinates
const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

// Component to fit map bounds
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
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fix Leaflet's default icon path issues in Next.js
    if (typeof window !== "undefined") {
      // @ts-expect-error - _getIconUrl is internal property
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  // Get color based on risk level from API data
  const getColor = (barangay: string): string => {
    const barangayData = data.find(
      (d) => d.barangay.toUpperCase() === barangay.toUpperCase()
    );
    // Gray out if no data found in API
    if (!barangayData) return "#9CA3AF"; 

    const risk = barangayData.summary.overall_risk_assessment;
    if (risk === "HIGH") return "#EF4444"; // Red
    if (risk === "MEDIUM") return "#F59E0B"; // Orange
    if (risk === "LOW") return "#3B82F6"; // Blue
    return "#3B82F6"; // Default
  };

  // Get opacity based on risk
  const getOpacity = (barangay: string): number => {
    const barangayData = data.find(
      (d) => d.barangay.toUpperCase() === barangay.toUpperCase()
    );
    // Lower opacity for grayed out areas
    if (!barangayData) return 0.3;

    const risk = barangayData.summary.overall_risk_assessment;
    if (risk === "HIGH") return 0.6;
    if (risk === "MEDIUM") return 0.5;
    return 0.4;
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
        
        {/* Base Map Tiles - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Barangay Polygons from external file */}
        {Object.entries(BARANGAY_BOUNDARIES).map(([barangay, coordinates]) => (
          <Polygon
            key={barangay}
            positions={coordinates}
            pathOptions={{
              color: getColor(barangay),
              fillColor: getColor(barangay),
              fillOpacity: getOpacity(barangay),
              weight: selectedBarangay === barangay ? 3 : 1,
            }}
            eventHandlers={{
              click: () => onBarangayClick(barangay),
              mouseover: (e) => {
                e.target.setStyle({ weight: 3, fillOpacity: 0.8 });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  weight: selectedBarangay === barangay ? 3 : 1,
                  fillOpacity: getOpacity(barangay),
                });
              },
            }}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]">
        <div className="font-semibold mb-2">Flood Risk Area Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High Risk Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Medium Risk Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Low Risk Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}