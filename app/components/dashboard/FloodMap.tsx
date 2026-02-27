"use client";

// FloodMap Component - Main Map Container
import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import MapLegend from "./MapLegend";
import { BARANGAY_FEATURES, type BarangayFeature } from "@/lib/barangay-data";
import { MAP_CONFIG, initializeLeafletIcons } from "@/lib/leaflet-config";
import "leaflet/dist/leaflet.css";

interface FloodMapProps {
  onBarangayClick?: (barangayName: string) => void;
}

export default function FloodMap({ onBarangayClick }: FloodMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [barangayData, setBarangayData] = useState<BarangayFeature[]>([]);

  // Initialize map and Leaflet on mount
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("./BarangayPolygon"),
    ]).then(([reactLeaflet, leaflet, polygonModule]) => {
      if (!isMounted) return;

      // Initialize Leaflet icons once
      initializeLeafletIcons(leaflet.default);

      // Create map component
      const Map = () => {
        const { MapContainer, TileLayer } = reactLeaflet;
        const BarangayPolygon = polygonModule.default;

        return (
          <MapContainer
            center={MAP_CONFIG.center}
            zoom={MAP_CONFIG.zoom}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url={MAP_CONFIG.tileLayerUrl} />
            
            {barangayData.map((feature) => (
              <BarangayPolygon
                key={feature.properties.Brgy}
                feature={feature}
                onBarangayClick={onBarangayClick}
              />
            ))}
          </MapContainer>
        );
      };

      setMapComponent(() => Map);
    });

    return () => {
      isMounted = false;
    };
  }, [barangayData, onBarangayClick]);

  // Load barangay data on mount
  useEffect(() => {
    setBarangayData(BARANGAY_FEATURES);

    // Simulate data update after 5 seconds
    const timer = setTimeout(() => {
      const updatedData = BARANGAY_FEATURES.map((feature) => {
        if (feature.properties.Brgy === "Lahug") {
          return { ...feature, properties: { ...feature.properties, level: "medium" as const } };
        }
        if (feature.properties.Brgy === "Banilad") {
          return { ...feature, properties: { ...feature.properties, level: "high" as const } };
        }
        return feature;
      });
      setBarangayData(updatedData);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-96">
        {MapComponent ? (
          <MapComponent />
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Loading map...</p>
          </div>
        )}

        {/* Search Input */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <input
            type="text"
            placeholder="Search for specific areas or incidents"
            className="w-full px-4 py-3 rounded-lg bg-white shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Legend */}
        <MapLegend />
      </div>
    </Card>
  );
}