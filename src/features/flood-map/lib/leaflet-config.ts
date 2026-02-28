import L from "leaflet";

export const CEBU_CENTER: [number, number] = [10.3157, 123.8854];
export const DEFAULT_ZOOM = 13;

export function initLeafletIcons() {
  if (typeof window === "undefined") return;
  // @ts-expect-error - _getIconUrl is internal
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}