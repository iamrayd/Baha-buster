// app/components/dashboard/FloodMap.tsx
"use client";

import { Card } from "../ui/Card";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamic imports to prevent SSR issues
const Map = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const Tiles = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Pin = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Tip = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Fix Leaflet icons once (type-safe, no `any`)
useEffect(() => {
  const proto = L.Icon.Default.prototype as { [key: string]: unknown };
  Reflect.deleteProperty(proto, "_getIconUrl");

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}, []);

// Alerts data
const alerts = [
  { name: "T. Padilla", lat: 10.3025, lng: 123.8921, level: "high" },
  { name: "Tinago", lat: 10.297, lng: 123.887, level: "medium" },
  { name: "Hipodromo", lat: 10.310, lng: 123.897, level: "medium" },
  { name: "Lorega", lat: 10.305, lng: 123.900, level: "low" },
] as const;

export default function FloodMap() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-96">
        <Map center={[10.3157, 123.8854]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <Tiles
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {alerts.map(alert => (
            <Pin
              key={alert.name}
              position={[alert.lat, alert.lng]}
              icon={L.divIcon({
                html: `<div style="background:${
                  alert.level === "high" ? "#ef4444" : alert.level === "medium" ? "#f97316" : "#3b82f6"
                };width:28px;height:28px;border-radius:50%;border:4px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)"></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              })}
            >
              <Tip>
                <div className="text-center">
                  <strong>Barangay {alert.name}</strong>
                  <div className={`mt-2 px-3 py-1 rounded text-white text-xs font-bold ${
                    alert.level === "high" ? "bg-red-600" : alert.level === "medium" ? "bg-orange-600" : "bg-blue-600"
                  }`}>
                    {alert.level.toUpperCase()} RISK
                  </div>
                </div>
              </Tip>
            </Pin>
          ))}
        </Map>

        <div className="absolute top-4 left-4 right-4 z-10">
          <input
            type="text"
            placeholder="Search for specific areas or incidents"
            className="w-full px-4 py-3 rounded-lg bg-white shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </Card>
  );
}