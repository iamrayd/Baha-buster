"use client";

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { GoogleMap, useJsApiLoader, Polygon, Marker } from "@react-google-maps/api";
import { BARANGAY_BOUNDARIES } from "../lib/barangay-data";
import { getRiskColor } from "../lib/polygon-styles";
import MapLegend from "./MapLegend";
import { LeafletMapProps } from "../types";
import { BarangayFloodData } from "@/src/types/global";
import { RiskLevel } from "@/src/types/global";

export interface GoogleMapHandle {
  flyToBarangay: (barangay: string) => void;
  panToLocation: (lat: number, lng: number, zoom?: number) => void;
}

const CEBU_CENTER = { lat: 10.3157, lng: 123.8854 };
const DEFAULT_ZOOM = 13;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#d4e6f1" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e0e0e0" }],
    },
  ],
};

function getPolygonPaths(coordinates: [number, number][]): google.maps.LatLngLiteral[] {
  return coordinates.map(([lat, lng]) => ({ lat, lng }));
}

function getCentroid(coordinates: [number, number][]): google.maps.LatLngLiteral {
  const latSum = coordinates.reduce((sum, [lat]) => sum + lat, 0);
  const lngSum = coordinates.reduce((sum, [, lng]) => sum + lng, 0);
  return {
    lat: latSum / coordinates.length,
    lng: lngSum / coordinates.length,
  };
}

interface BarangayPolygonProps {
  barangay: string;
  coordinates: [number, number][];
  risk?: RiskLevel;
  isSelected: boolean;
  hasData: boolean;
  onClick: (barangay: string) => void;
}

function BarangayPolygonComponent({
  barangay,
  coordinates,
  risk,
  isSelected,
  hasData,
  onClick,
}: BarangayPolygonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const color = getRiskColor(risk);

  return (
    <Polygon
      paths={getPolygonPaths(coordinates)}
      options={{
        fillColor: color,
        fillOpacity: isHovered ? 0.8 : hasData ? 0.6 : 0.3,
        strokeColor: color,
        strokeWeight: isSelected || isHovered ? 3 : 1,
        strokeOpacity: 1,
        clickable: true,
      }}
      onClick={() => onClick(barangay)}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    />
  );
}

const FloodGoogleMap = forwardRef<GoogleMapHandle, LeafletMapProps>(
  function FloodGoogleMap(
    { data, onBarangayClick, selectedBarangay, riskFilter, setRiskFilter, sosAlerts, evacuationCenters, showEvacuation, onToggleEvacuation },
    ref
  ) {
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    });

    const onLoad = useCallback((map: google.maps.Map) => {
      mapRef.current = map;
      if (selectedBarangay) {
        // Small delay to ensure map is fully rendered before panning
        setTimeout(() => {
          const coords = BARANGAY_BOUNDARIES[selectedBarangay.toUpperCase()];
          if (coords && coords.length > 0) {
            const centroid = getCentroid(coords);
            map.panTo(centroid);
            map.setZoom(15);
          }
        }, 100);
      }
    }, [selectedBarangay]);

    useImperativeHandle(ref, () => ({
      flyToBarangay(barangay: string) {
        const coords = BARANGAY_BOUNDARIES[barangay.toUpperCase()];
        if (!coords || coords.length === 0 || !mapRef.current) return;
        const centroid = getCentroid(coords);
        mapRef.current.panTo(centroid);
        mapRef.current.setZoom(15);
      },
      panToLocation(lat: number, lng: number, zoom?: number) {
        if (!mapRef.current) return;
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(zoom ?? 17);
      },
    }));

    if (loadError) {
      return (
        <div
          className="h-96 flex items-center justify-center"
          style={{ background: "var(--color-gray-100)", borderRadius: "var(--radius-card)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-risk-high)" }}>
            Failed to load Google Maps
          </p>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div
          className="h-96 flex items-center justify-center animate-pulse"
          style={{ background: "var(--color-gray-100)", borderRadius: "var(--radius-card)" }}
        >
          <div className="text-center">
            <div
              className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "var(--color-gray-300)", borderTopColor: "var(--color-primary)" }}
            />
            <span className="text-sm font-medium" style={{ color: "var(--color-gray-500)" }}>Loading Map...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200 relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={CEBU_CENTER}
          zoom={DEFAULT_ZOOM}
          options={mapOptions}
          onLoad={onLoad}
        >
          {Object.entries(BARANGAY_BOUNDARIES).map(([barangay, coordinates]) => {
            const barangayData = data.find(
              (d: BarangayFloodData) => d.barangay.toUpperCase() === barangay.toUpperCase()
            );
            const risk = barangayData?.predictions?.[0]?.risk_level;

            if (riskFilter !== "ALL" && (!risk || risk !== riskFilter)) return null;

            return (
              <BarangayPolygonComponent
                key={barangay}
                barangay={barangay}
                coordinates={coordinates}
                risk={risk}
                isSelected={selectedBarangay === barangay}
                hasData={!!barangayData}
                onClick={onBarangayClick}
              />
            );
          })}
          {sosAlerts?.filter(sos => sos.status === 'active').map((sos, index) => {
            const sosSvg = encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="#E53E3E" stroke="#FFFFFF" stroke-width="3" />
                <text x="24" y="29" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">SOS</text>
              </svg>
            `);

            return (
              <Marker
                key={sos.id || sos.sos_id || `sos-${index}`}
                position={{ lat: sos.latitude, lng: sos.longitude }}
                title={`SOS Alert - ${sos.barangay}\nFrom: ${sos.requester_name || 'Unknown User'}\nTime: ${(() => {
                  const ts = sos.timestamp || sos.created_at;
                  if (!ts) return new Date().toLocaleString();
                  let parsed = ts;
                  if (!/(Z|[+-]\d{2}:\d{2})$/.test(parsed)) parsed = parsed.replace(' ', 'T') + 'Z';
                  let d = new Date(parsed);
                  if (isNaN(d.getTime())) d = new Date(ts);
                  return d.toLocaleString();
                })()}`}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${sosSvg}`,
                  scaledSize: new google.maps.Size(40, 40),
                  anchor: new google.maps.Point(20, 20),
                }}
                zIndex={999}
              />
            );
          })}
          {/* Evacuation center markers */}
          {showEvacuation && evacuationCenters?.map((center, index) => {
            const evacSvg = encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
                <path d="M20 0 C9 0 0 9 0 20 C0 35 20 48 20 48 C20 48 40 35 40 20 C40 9 31 0 20 0Z" fill="#38A169" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="20" cy="18" r="10" fill="white" opacity="0.3"/>
                <text x="20" y="23" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">E</text>
              </svg>
            `);

            return (
              <Marker
                key={`evac-${index}`}
                position={{ lat: center.lat, lng: center.lng }}
                title={`${center.name}\n${center.address}\nBarangay: ${center.barangay}`}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${evacSvg}`,
                  scaledSize: new google.maps.Size(32, 38),
                  anchor: new google.maps.Point(16, 38),
                }}
                zIndex={500}
              />
            );
          })}
        </GoogleMap>
        <MapLegend riskFilter={riskFilter} setRiskFilter={setRiskFilter} />

        {/* Evacuation centers toggle */}
        {onToggleEvacuation && (
          <button
            onClick={onToggleEvacuation}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg z-10"
            style={{
              background: showEvacuation ? '#38A169' : '#fff',
              color: showEvacuation ? '#fff' : 'var(--color-gray-600)',
              border: showEvacuation ? '1px solid #38A169' : '1px solid var(--color-gray-200)',
            }}
            title={showEvacuation ? 'Hide evacuation centers' : 'Show evacuation centers'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {showEvacuation ? 'Hide Evac Centers' : 'Evac Centers'}
          </button>
        )}
      </div>
    );
  }
);

export default FloodGoogleMap;
