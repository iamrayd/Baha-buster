"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CEBU_CENTER, DEFAULT_ZOOM, initLeafletIcons } from "../lib/leaflet-config";
import MapBounds from "./MapBounds";
import MapLegend from "./MapLegend";
import BarangayPolygons from "./BarangayPolygon";
import { LeafletMapProps } from "../types";

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
    initLeafletIcons();
  }, []);

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
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapBounds />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BarangayPolygons
          data={data}
          selectedBarangay={selectedBarangay}
          riskFilter={riskFilter}
          onBarangayClick={onBarangayClick}
        />
      </MapContainer>
      <MapLegend riskFilter={riskFilter} setRiskFilter={setRiskFilter} />
    </div>
  );
}