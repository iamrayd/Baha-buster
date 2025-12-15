// components/dashboard/QuickStats.tsx
import { Card } from "../ui/Card";
import { BarangayFloodData } from "@/app/types";

interface QuickStatsProps {
  data: BarangayFloodData[];
  loading: boolean;
}

export default function QuickStats({ data, loading }: QuickStatsProps) {
  // Calculate dynamic stats from the API data
  const highRiskCount = data.filter(d => d.summary.overall_risk_assessment === "HIGH").length;
  const mediumRiskCount = data.filter(d => d.summary.overall_risk_assessment === "MEDIUM").length;
  
  // Example logic: "Active Alerts" = High + Medium risks
  const activeAlerts = highRiskCount + mediumRiskCount;
  
  // Example logic: "Areas Monitored" = total data points
  const areasMonitored = data.length || 0;

  // Placeholder for teams (since it's not in the API yet)
  const teamsDeployed = Math.ceil(activeAlerts * 1.5); 

  const stats = [
    { label: "Active Alerts (High/Med)", value: loading ? "-" : activeAlerts, color: "text-red-600" },
    { label: "Barangays Monitored", value: loading ? "-" : areasMonitored, color: "text-blue-600" },
    { label: "Response Teams Ready", value: loading ? "-" : teamsDeployed, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          <p className={`text-4xl font-bold mt-2 ${stat.color} transition-all duration-500`}>
            {stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
}