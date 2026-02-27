import { Package } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600 mt-1">
          Manage emergency resources and response team equipment.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Resources Module Coming Soon
          </h2>
          <p className="text-gray-500">
            This section will track available resources and deployment status.
          </p>
        </div>
      </div>
    </div>
  );
}