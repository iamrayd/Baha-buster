//Polygon Styling Logic
import type { RiskLevel } from "./barangay-data";

interface PolygonStyle {
  fillColor: string;
  weight: number;
  opacity: number;
  color: string;
  fillOpacity: number;
}

// Style configuration for each risk level
const RISK_LEVEL_STYLES: Record<RiskLevel, PolygonStyle> = {
  high: {
    color: "#dc2626",       // Red border
    fillColor: "#ef4444",   // Red fill
    fillOpacity: 0.4,
    weight: 2,
    opacity: 1,
  },
  medium: {
    color: "#f97316",       // Orange border
    fillColor: "#fb923c",   // Orange fill
    fillOpacity: 0.3,
    weight: 2,
    opacity: 1,
  },
  low: {
    color: "#3b82f6",       // Blue border
    fillColor: "#60a5fa",   // Blue fill
    fillOpacity: 0.2,
    weight: 2,
    opacity: 1,
  },
};

// Default style for unknown risk levels
const DEFAULT_STYLE: PolygonStyle = {
  color: "#a0a0a0",
  fillColor: "#cccccc",
  fillOpacity: 0.1,
  weight: 2,
  opacity: 1,
};

// Get polygon style based on risk level
export function getPolygonStyle(level?: RiskLevel): PolygonStyle {
  if (!level) return DEFAULT_STYLE;
  return RISK_LEVEL_STYLES[level] || DEFAULT_STYLE;
}

// Get CSS class for risk level badge
export function getRiskLevelBadgeClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    high: "bg-red-600",
    medium: "bg-orange-600",
    low: "bg-blue-600",
  };
  return classes[level] || "bg-gray-600";
}