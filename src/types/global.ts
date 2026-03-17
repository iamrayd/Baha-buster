export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Prediction {
  day: number;
  flood_probability: number;
  predicted_depth_cm: number;
  risk_level: RiskLevel;
  alert: number; // 0 or 1
  summary: string; // Notice this is a string now, not an object!
}

export interface ClassificationMetrics {
  f1: number;
  precision: number;
  recall: number;
  auc: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

export interface RegressionMetrics {
  mae_cm: number | null;
  r2: number | null;
}

export interface Metrics {
  classification: ClassificationMetrics;
  regression: RegressionMetrics;
}

export interface BarangayFloodData {
  barangay: string;
  predictions: Prediction[];
  metrics: Metrics;
}

export interface ApiResponse {
  count: number;
  barangays: BarangayFloodData[];
  failed: string[];
}