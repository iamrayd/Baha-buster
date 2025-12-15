"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card } from "../ui/Card";
import FloodDataChart from "./FloodDataChart";
import { BarangayFloodData } from "@/app/types";

// Dynamically import the map to avoid SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  ),
});

interface FloodMapProps {
  data: BarangayFloodData[];
  loading: boolean;
}

export default function FloodMap({ data, loading }: FloodMapProps) {
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Map Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Flood Risk Map - Cebu City
          </h2>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Loading forecast data...</span>
            </div>
          )}
          {!loading && data.length === 0 && (
            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              ⚠️ Showing map without forecast data
            </div>
          )}
        </div>

        {/* Leaflet Map */}
        <Suspense
          fallback={
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Initializing map...</div>
            </div>
          }
        >
          <LeafletMap
            data={data}
            onBarangayClick={setSelectedBarangay}
            selectedBarangay={selectedBarangay}
          />
        </Suspense>

        {/* Selected Barangay Quick Info */}
        {selectedBarangay && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {selectedBarangay}
                </h3>
                {data.find((d) => d.barangay === selectedBarangay) && (
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <p className="font-semibold text-gray-900">
                        {
                          data.find((d) => d.barangay === selectedBarangay)
                            ?.summary.overall_risk_assessment
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Predicted Depth:</span>
                      <p className="font-semibold text-gray-900">
                        {
                          data.find((d) => d.barangay === selectedBarangay)
                            ?.forecasts[0]?.predicted_flood_depth_cm
                        }
                        cm
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Probability:</span>
                      <p className="font-semibold text-gray-900">
                        {
                          data.find((d) => d.barangay === selectedBarangay)
                            ?.forecasts[0]?.flood_probability_percent
                        }
                        %
                      </p>
                    </div>
                  </div>
                )}
                {!data.find((d) => d.barangay === selectedBarangay) && (
                  <p className="text-sm text-gray-500 mt-2">
                    No forecast data available for this barangay
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedBarangay(null)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Chart Component */}
      {data.length > 0 ? (
        <FloodDataChart barangayName={selectedBarangay} />
      ) : selectedBarangay ? (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedBarangay} Forecast
          </h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600 font-medium">No Forecast Data</p>
              <p className="text-sm text-gray-500 mt-1">
                Unable to retrieve forecast data from API
              </p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}