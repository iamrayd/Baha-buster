// app/dashboard/page.tsx
import QuickStats from "../components/dashboard/QuickStats";
import RealTimeAlerts from "../components/dashboard/RealTimeAlerts";
import FloodMap from "../components/dashboard/FloodMap";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of current flood risks and disaster response activities in Cebu City.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <FloodMap />
          <QuickStats />
        </div>
        <div className="xl:col-span-1">
          <RealTimeAlerts />
        </div>
      </div>
    </div>
  );
}