/* eslint-disable @typescript-eslint/no-explicit-any */
// Barangay Polygon Component
import { useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import type L from "leaflet";
import type { BarangayFeature } from "@/lib/barangay-data";
import { getPolygonStyle, getRiskLevelBadgeClass } from "@/lib/polygon-styles";


interface BarangayPolygonProps {
  feature: BarangayFeature;
  onBarangayClick?: (barangayName: string) => void;
}

export default function BarangayPolygon({ feature, onBarangayClick }: BarangayPolygonProps) {
  // Memoize style calculation - expensive operation
  const style = useMemo(() => {
    return getPolygonStyle(feature.properties.level);
  }, [feature.properties.level]);

  // Memoize event handlers - prevent recreation on every render
  const onEachFeature = useMemo(() => {
    return (feat: any, layer: L.Layer) => {
      const { Brgy, level } = feat.properties;
      
      if (!Brgy || !level) return;

      const badgeClass = getRiskLevelBadgeClass(level);

      // Bind popup with barangay info
      layer.bindPopup(`
        <div class="text-center font-medium">
          Barangay ${Brgy}
          <div class="mt-2 px-3 py-1 rounded text-white text-xs font-bold ${badgeClass}">
            ${level.toUpperCase()} RISK ZONE
          </div>
        </div>
      `);

      // Click handler
      layer.on("click", () => {
        if (onBarangayClick) {
          onBarangayClick(Brgy);
        }
      });

      // Hover effects
      layer.on("mouseover", (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).setStyle({
          weight: 3,
          opacity: 1,
          fillOpacity: 0.7,
        });
      });

      layer.on("mouseout", (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).setStyle(style);
      });
    };
  }, [onBarangayClick, style]);

  return (
    <GeoJSON
      key={feature.properties.Brgy}
      data={feature as any}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}