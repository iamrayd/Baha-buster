import { MapLegendProps } from "../types";

export default function MapLegend({ riskFilter, setRiskFilter }: MapLegendProps) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000] border border-gray-200">
      <div className="font-bold text-gray-700 mb-2 border-b pb-1">Legend</div>
      <div className="space-y-1">
        <button
          onClick={() => setRiskFilter("ALL")}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
            riskFilter === "ALL" ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-3 h-3 bg-gray-500 rounded border border-gray-600" />
          <span>Show All</span>
        </button>
        <button
          onClick={() => setRiskFilter("HIGH")}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
            riskFilter === "HIGH" ? "bg-red-50 font-bold text-red-800" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-3 h-3 bg-red-500 rounded border border-red-600" />
          <span>High Risk</span>
        </button>
        <button
          onClick={() => setRiskFilter("MEDIUM")}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
            riskFilter === "MEDIUM" ? "bg-orange-50 font-bold text-orange-800" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-3 h-3 bg-orange-500 rounded border border-orange-600" />
          <span>Medium Risk</span>
        </button>
        <button
          onClick={() => setRiskFilter("LOW")}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded transition-colors ${
            riskFilter === "LOW" ? "bg-blue-50 font-bold text-blue-800" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-3 h-3 bg-blue-500 rounded border border-blue-600" />
          <span>Low Risk</span>
        </button>
      </div>
    </div>
  );
}