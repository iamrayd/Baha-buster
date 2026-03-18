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

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <AlertCircle className="text-red-600" size={20} />
        <h2 className="text-lg font-semibold">Priority Alerts</h2>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Analyzing satellite data...
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <CheckCircle className="text-green-500 mb-2" size={32} />
            <p className="text-sm">No critical flood risks detected.</p>
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
                className={`
                  w-full text-left flex items-center justify-between gap-3
                  px-3 py-3 rounded-lg border transition-all
                  ${isSelected
                    ? "bg-blue-50 border-blue-300 shadow-sm"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200"
                  }
                `}
              >
                {/* Left: barangay info */}
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin
                    size={14}
                    className={`shrink-0 mt-0.5 ${isSelected ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {alert.barangay}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500">
                        Depth: <span className="font-medium text-gray-700">{depth.toFixed(1)} cm</span>
                      </span>
                      <span className="text-gray-300 text-xs">|</span>
                      <span className="text-xs text-gray-500">
                        Prob: <span className="font-medium text-gray-700">{(probability * 100).toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: risk badge */}
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
        <p className="text-xs text-gray-400 text-center mt-3 shrink-0 pt-3 border-t border-gray-100">
          Click a barangay to zoom in on the map
        </p>
      )}
    </Card>
  );
}