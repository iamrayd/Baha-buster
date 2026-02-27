import { AlertTriangle } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor flood alerts across Cebu City barangays.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Alerts Module Coming Soon
          </h2>
          <p className="text-gray-500">
            This section will display real-time flood alerts and notifications.
          </p>
        </div>
      </div>
    </div>
  );
}