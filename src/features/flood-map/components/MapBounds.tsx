import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { CEBU_CENTER, DEFAULT_ZOOM } from "../lib/leaflet-config";

// This component ensures the map is centered on Cebu with the default zoom level when it loads
export default function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setView(CEBU_CENTER, DEFAULT_ZOOM);
  }, [map]);
  return null;
}