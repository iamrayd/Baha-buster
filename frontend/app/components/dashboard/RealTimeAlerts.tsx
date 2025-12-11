// components/dashboard/RealTimeAlerts.tsx
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AlertCircle } from "lucide-react";

const alerts = [
  { barangay: "T. Padilla", time: "2 mins ago", level: "high" },
  { barangay: "Tinago", time: "15 mins ago", level: "medium" },
  { barangay: "Hipodromo", time: "25 mins ago", level: "medium" },
  { barangay: "Lorega", time: "45 mins ago", level: "low" },
  { barangay: "Zapatera", time: "1 hour ago", level: "low" },
  { barangay: "Day-as", time: "1.5 hours ago", level: "low" },
  { barangay: "Kamagayan", time: "2 hours ago", level: "low" },
];

export default function RealTimeAlerts() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-red-600" size={20} />
        <h2 className="text-lg font-semibold">Real-Time Alerts</h2>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.barangay}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium">Barangay {alert.barangay}</p>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>
            <Badge variant={alert.level as any}>
              {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}