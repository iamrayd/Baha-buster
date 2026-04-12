import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { AlertCircle, CheckCircle, MapPin } from "lucide-react";
import { BarangayFloodData } from "@/src/types/global";

interface RealTimeAlertsProps {
  data: BarangayFloodData[];
  loading: boolean;
  onBarangayClick: (barangay: string) => void;
  selectedBarangay: string | null;
}

export default function RealTimeAlerts({
  data,
  loading,
  onBarangayClick,
  selectedBarangay,
}: RealTimeAlertsProps) {
  const alerts = data
    .filter((item) => {
      const risk = item.predictions?.[0]?.risk_level;
      return risk === "HIGH" || risk === "MEDIUM" || risk === "LOW";
    })
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      const riskA = a.predictions?.[0]?.risk_level ?? "LOW";
      const riskB = b.predictions?.[0]?.risk_level ?? "LOW";
      return order[riskA] - order[riskB];
    });

  const riskBorderColors = {
    HIGH: "var(--color-risk-high)",
    MEDIUM: "var(--color-risk-medium)",
    LOW: "var(--color-risk-low)",
  };

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--color-risk-high-bg)" }}
        >
          <AlertCircle size={16} style={{ color: "var(--color-risk-high)" }} />
        </div>
        <div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>
            Priority Alerts
          </h2>
          <p className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>
            {alerts.length} barangay{alerts.length !== 1 ? "s" : ""} monitored
          </p>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {loading ? (
          <div className="text-center py-10 text-sm" style={{ color: "var(--color-gray-400)" }}>
            <div
              className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "var(--color-gray-300)", borderTopColor: "var(--color-primary)" }}
            />
            Analyzing satellite data...
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle className="mb-2" size={32} style={{ color: "var(--color-risk-low)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--color-gray-600)" }}>
              No critical flood risks detected.
            </p>
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const prediction   = alert.predictions?.[0];
            const riskLevel    = prediction?.risk_level ?? "LOW";
            const depth        = prediction?.predicted_depth_cm ?? 0;
            const probability  = prediction?.flood_probability ?? 0;
            const isSelected   = selectedBarangay === alert.barangay;

            return (
              <button
                key={`${alert.barangay}-${idx}`}
                onClick={() => onBarangayClick(alert.barangay)}
                className="w-full text-left flex items-center justify-between gap-3 px-3.5 py-3 transition-all duration-200"
                style={{
                  borderRadius: "var(--radius-input)",
                  background: isSelected ? "rgba(44, 82, 130, 0.06)" : "var(--color-gray-50)",
                  borderLeft: `3px solid ${riskBorderColors[riskLevel]}`,
                  boxShadow: isSelected ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin
                    size={14}
                    className="shrink-0 mt-0.5"
                    style={{ color: isSelected ? "var(--color-primary)" : "var(--color-gray-400)" }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-gray-700)" }}>
                      {alert.barangay}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px]" style={{ color: "var(--color-gray-500)" }}>
                        Depth: <span className="font-semibold" style={{ color: "var(--color-gray-700)" }}>{depth.toFixed(1)} cm</span>
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-gray-300)" }}>|</span>
                      <span className="text-[11px]" style={{ color: "var(--color-gray-500)" }}>
                        Prob: <span className="font-semibold" style={{ color: "var(--color-gray-700)" }}>{(probability * 100).toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Badge variant={riskLevel.toLowerCase() as "high" | "medium" | "low"}>
                    {riskLevel}
                  </Badge>
                </div>
              </button>
            );
          })
        )}
      </div>

      {alerts.length > 0 && !loading && (
        <p className="text-[11px] text-center mt-3 shrink-0 pt-3" style={{ color: "var(--color-gray-400)", borderTop: "1px solid var(--color-gray-100)" }}>
          Click a barangay to zoom in on the map
        </p>
      )}
    </Card>
  );
}