"use client";

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CEBU_CENTER, DEFAULT_ZOOM, initLeafletIcons } from "../lib/leaflet-config";
import { BARANGAY_BOUNDARIES } from "../lib/barangay-data";
import MapBounds from "./MapBounds";
import MapLegend from "./MapLegend";
import BarangayPolygons from "./BarangayPolygon";
import { LeafletMapProps } from "../types";


export interface LeafletMapHandle {
  flyToBarangay: (barangay: string) => void;
}
interface MapControllerProps {
  flyTarget: string | null;
  onFlyComplete: () => void;
}

function MapController({ flyTarget, onFlyComplete }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!flyTarget) return;

    const coords = BARANGAY_BOUNDARIES[flyTarget.toUpperCase()];
    if (!coords || coords.length === 0) return;

    // Compute the centroid of the polygon
    const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = coords.reduce((sum, [, lng]) => sum + lng, 0);
    const centroid: [number, number] = [
      latSum / coords.length,
      lngSum / coords.length,
    ];

    map.flyTo(centroid, 15, { animate: true, duration: 1.2 });
    onFlyComplete();
  }, [flyTarget, map, onFlyComplete]);

  return null;
}

const LeafletMap = forwardRef<LeafletMapHandle, LeafletMapProps>(
  function LeafletMap(
    { data, onBarangayClick, selectedBarangay, riskFilter, setRiskFilter },
    ref
  ) {
    const [isMounted, setIsMounted]     = useState(false);
    const [flyTarget, setFlyTarget]     = useState<string | null>(null);

    useEffect(() => {
      setIsMounted(true);
      initLeafletIcons();
    }, []);

    // Expose flyToBarangay to parent via ref
    useImperativeHandle(ref, () => ({
      flyToBarangay(barangay: string) {
        setFlyTarget(barangay);
      },
    }));

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
          <MapController
            flyTarget={flyTarget}
            onFlyComplete={() => setFlyTarget(null)}
          />
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
);

export default LeafletMap;