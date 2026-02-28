import { RiskLevel } from "@/src/types/global";

export function getRiskColor(risk?: RiskLevel): string {
  if (risk === "HIGH") return "#EF4444";
  if (risk === "MEDIUM") return "#F59E0B";
  if (risk === "LOW") return "#3B82F6";
  return "#9CA3AF";
}

export function getPolygonStyle(
  risk: RiskLevel | undefined,
  isSelected: boolean,
  hasData: boolean
) {
  return {
    color: getRiskColor(risk),
    fillColor: getRiskColor(risk),
    fillOpacity: hasData ? 0.6 : 0.3,
    weight: isSelected ? 3 : 1,
  };
}