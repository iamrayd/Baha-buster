import { Polygon } from "react-leaflet";
import { BARANGAY_BOUNDARIES } from "../lib/barangay-data";
import { getPolygonStyle } from "../lib/polygon-styles";
import { BarangayPolygonsProps } from "../types";

export default function BarangayPolygons({
  data,
  selectedBarangay,
  riskFilter,
  onBarangayClick,
}: BarangayPolygonsProps) {
  return (
    <>
      {Object.entries(BARANGAY_BOUNDARIES).map(([barangay, coordinates]) => {
        const barangayData = data.find(
          (d) => d.barangay.toUpperCase() === barangay.toUpperCase()
        );
        const risk = barangayData?.summary.overall_risk_assessment;

        if (riskFilter !== "ALL" && (!risk || risk !== riskFilter)) return null;

        const isSelected = selectedBarangay === barangay;
        const style = getPolygonStyle(risk, isSelected, !!barangayData);

        return (
          <Polygon
            key={barangay}
            positions={coordinates}
            pathOptions={style}
            eventHandlers={{
              click: () => onBarangayClick(barangay),
              mouseover: (e) => e.target.setStyle({ weight: 3, fillOpacity: 0.8 }),
              mouseout: (e) =>
                e.target.setStyle({
                  weight: isSelected ? 3 : 1,
                  fillOpacity: barangayData ? 0.6 : 0.3,
                }),
            }}
          />
        );
      })}
    </>
  );
}