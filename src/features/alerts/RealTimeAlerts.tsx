import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { BarangayFloodData } from "@/src/types/global";

interface RealTimeAlertsProps {
  data: BarangayFloodData[];
  loading: boolean;
}

export default function RealTimeAlerts({ data, loading }: RealTimeAlertsProps) {
  // FIXED: Filter and sort using predictions[0].risk_level instead of summary
  const alerts = data
    .filter((item) => {
      const risk = item.predictions?.[0]?.risk_level;
      return risk === "HIGH" || risk === "MEDIUM" || risk === "LOW";
    })
    .sort((a, b) => {
      // Sort so HIGH risks appear at the top
      const riskA = a.predictions?.[0]?.risk_level || "LOW";
      const riskB = b.predictions?.[0]?.risk_level || "LOW";
      
      if (riskA === "HIGH" && riskB !== "HIGH") return -1;
      if (riskA !== "HIGH" && riskB === "HIGH") return 1;
      return 0;
    });

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <AlertCircle className="text-red-600" size={20} />
        <h2 className="text-lg font-semibold">Priority Alerts</h2>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 flex-1">
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
            // FIXED: Safely extract today's prediction data
            const prediction = alert.predictions?.[0];
            const riskLevel = prediction?.risk_level || "LOW";
            const depth = prediction?.predicted_depth_cm || 0;

            return (
              <div
                key={`${alert.barangay}-${idx}`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition border border-gray-100"
              >
                <div>
                  <p className="font-bold text-gray-800">{alert.barangay}</p>
                  <p className="text-xs text-gray-500">
                    Depth: {depth} cm
                  </p>
                </div>
                <Badge variant={riskLevel.toLowerCase() as "high" | "medium" | "low"}>
                  {riskLevel}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}