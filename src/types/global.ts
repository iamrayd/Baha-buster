export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Forecast {
  day: number;
  date: string;
  predicted_flood_depth_cm: number;
  risk_level: RiskLevel;
  flood_probability_percent: number;
}

export interface RiskDistribution {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

export interface Summary {
  total_predicted_rainfall: number;
  max_risk_level: RiskLevel;
  risk_distribution: RiskDistribution;
  overall_risk_assessment: RiskLevel;
}

export interface BarangayFloodData {
  barangay: string;
  forecasts: Forecast[];
  summary: Summary;
}

export type ApiResponse = BarangayFloodData[];