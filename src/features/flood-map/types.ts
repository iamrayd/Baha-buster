import { RiskLevel, BarangayFloodData } from "@/src/types/global";
import { SOSAlert } from "@/src/services/api";

export interface LeafletMapProps {
  data: BarangayFloodData[];
  onBarangayClick: (barangay: string) => void;
  selectedBarangay: string | null;
  riskFilter: RiskLevel | "ALL";
  setRiskFilter: (filter: RiskLevel | "ALL") => void;
  sosAlerts?: SOSAlert[];
}

export interface BarangayPolygonsProps {
  data: BarangayFloodData[];
  selectedBarangay: string | null;
  riskFilter: RiskLevel | "ALL";
  onBarangayClick: (barangay: string) => void;
}

export interface MapLegendProps {
  riskFilter: RiskLevel | "ALL";
  setRiskFilter: (filter: RiskLevel | "ALL") => void;
}