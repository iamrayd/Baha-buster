// Initializes Leaflet icons and provides map defaults
export const MAP_CONFIG = {
  center: [10.33, 123.88] as [number, number],
  zoom: 13,
  tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; OpenStreetMap contributors',
} as const;

export const LEAFLET_ICON_CONFIG = {
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
} as const;

//Initialize Leaflet icon configuration
export function initializeLeafletIcons(L: typeof import("leaflet")) {
  const proto = L.Icon.Default.prototype as unknown as Record<string, unknown>;
  delete proto._getIconUrl;
  L.Icon.Default.mergeOptions(LEAFLET_ICON_CONFIG);
}