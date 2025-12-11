// components/dashboard/QuickStats.tsx
import { Card } from "../ui/Card";

export default function QuickStats() {
  const stats = [
    { label: "Active Alerts", value: 5, color: "text-red-600" },
    { label: "Areas at Risk", value: 12, color: "text-yellow-600" },
    { label: "Response Teams Deployed", value: 8, color: "text-blue-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-gray-600 text-sm">{stat.label}</p>
          <p className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}