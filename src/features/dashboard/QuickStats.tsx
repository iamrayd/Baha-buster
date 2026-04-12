import { Card } from "@/src/components/ui/Card";
import { BarangayFloodData } from "@/src/types/global";
import { AlertTriangle, MapPin, Shield } from "lucide-react";

interface QuickStatsProps {
  data: BarangayFloodData[];
  loading: boolean;
}

export default function QuickStats({ data, loading }: QuickStatsProps) {
  const highRiskCount = data.filter((d) => d.predictions?.[0]?.risk_level === "HIGH").length;
  const mediumRiskCount = data.filter((d) => d.predictions?.[0]?.risk_level === "MEDIUM").length;
  
  const activeAlerts = highRiskCount + mediumRiskCount;
  const areasMonitored = data.length;
  const teamsDeployed = Math.ceil(activeAlerts * 1.5);

  const stats = [
    {
      label: "Active Alerts",
      subtitle: "High & Medium risk",
      value: loading ? "—" : activeAlerts,
      icon: AlertTriangle,
      iconBg: "var(--color-risk-high-bg)",
      iconColor: "var(--color-risk-high)",
      valueColor: "var(--color-risk-high)",
    },
    {
      label: "Barangays Monitored",
      subtitle: "Across Cebu City",
      value: loading ? "—" : areasMonitored,
      icon: MapPin,
      iconBg: "rgba(44, 82, 130, 0.1)",
      iconColor: "var(--color-primary)",
      valueColor: "var(--color-primary)",
    },
    {
      label: "Response Teams",
      subtitle: "Ready to deploy",
      value: loading ? "—" : teamsDeployed,
      icon: Shield,
      iconBg: "var(--color-risk-low-bg)",
      iconColor: "var(--color-risk-low)",
      valueColor: "var(--color-risk-low)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: stat.iconBg }}
            >
              <stat.icon size={22} style={{ color: stat.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--color-gray-600)" }}>
                {stat.label}
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>
                {stat.subtitle}
              </p>
            </div>
            <p
              className="text-3xl font-bold transition-all duration-500"
              style={{ color: stat.valueColor }}
            >
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}