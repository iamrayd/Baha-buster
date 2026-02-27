import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">
          Generate and view flood incident reports and analytics.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Reports Module Coming Soon
          </h2>
          <p className="text-gray-500">
            This section will display comprehensive flood reports and statistics.
          </p>
        </div>
      </div>
    </div>
  );
}