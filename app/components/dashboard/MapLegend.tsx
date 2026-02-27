// Map Legend Component
interface LegendItem {
  color: string;
  label: string;
  borderColor: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { color: "bg-red-500", borderColor: "border-red-700", label: "High Risk Area" },
  { color: "bg-orange-500", borderColor: "border-orange-700", label: "Medium Risk Area" },
  { color: "bg-blue-500", borderColor: "border-blue-700", label: "Low Risk Area" },
];

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-lg shadow-xl text-xs space-y-1">
      <p className="font-bold mb-1">Flood Risk Area Legend</p>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center">
          <div 
            className={`w-4 h-4 rounded-sm ${item.color} ${item.borderColor} mr-2 opacity-50 border`} 
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}