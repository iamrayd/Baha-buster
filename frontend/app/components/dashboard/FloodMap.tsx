"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import "leaflet/dist/leaflet.css";

let L: typeof import("leaflet") | null = null;

// Initial GeoJSON Data
const initialBarangayFeatures = [
  {
    "type" : "Feature", 
    "geometry" : {
        "type" : "Polygon", 
        "coordinates" : [
          [
            [123.874261990998, 10.3317761588427], 
            [123.87986060888, 10.332151916278], 
            [123.88840940507, 10.3271196383607], 
            [123.889751175576, 10.322030500807], 
            [123.888398909982, 10.3173160379049], 
            [123.889628544022, 10.3121786903943], 
            [123.888621618993, 10.3081254081611], 
            [123.886706858934, 10.307895577419], 
            [123.886648101729, 10.3085556429286], 
            [123.882792324107, 10.3075936947932], 
            [123.880894752791, 10.3140365251655], 
            [123.87439736055, 10.3108323774123], 
            [123.869702028926, 10.3143170102219], 
            [123.858870917059, 10.3198271330158], 
            [123.874261990998, 10.3317761588427]
          ]
        ]
    }, 
    "properties" : { "Brgy" : "Guadalupe", "level": "high" }
  },
  {
    "type" : "Feature", 
    "geometry" : {
        "type" : "Polygon", 
        "coordinates" : [
            [[123.87439736055, 10.3108323774123], [123.880894752791, 10.3140365251655], [123.882792324107, 10.3075936947932], [123.885053403192, 10.2981644065621], [123.885084563802, 10.2980364285384], [123.885147215971, 10.2977341717946], [123.88538689339, 10.2975403229276], [123.885808358869, 10.2967467611542], [123.885678985097, 10.2966647915469], [123.880328537832, 10.2932783107455], [123.880199166758, 10.2931964256746], [123.88016025759, 10.2933244243827], [123.87972558197, 10.2947545973469], [123.878525020314, 10.2974406348774], [123.877652906357, 10.2993164399018], [123.876719495508, 10.302142956932], [123.875169323306, 10.3056214212916], [123.872478068808, 10.3069922192156], [123.869702028926, 10.3143170102219], [123.87439736055, 10.3108323774123]]
      ]
    }, 
    "properties" : { "Brgy" : "Labangon", "level": "medium" }
  },
  {
    "type" : "Feature", 
    "geometry" : {
        "type" : "Polygon", 
        "coordinates" : [
          [
            [123.874379827367, 10.2891623457657], 
            [123.874476395669, 10.2927549268984], 
            [123.876271487439, 10.2929120996138], 
            [123.876762025347, 10.2929591287609], 
            [123.877568562539, 10.2934203577634], 
            [123.87972558197, 10.2947545973469], 
            [123.88016025759, 10.2933244243827], 
            [123.880199166758, 10.2931964256746], 
            [123.88025264944, 10.2930683864969], 
            [123.880834161867, 10.2916762413655], 
            [123.880888110398, 10.2915470879278], 
            [123.881016949972, 10.291437490248], 
            [123.881732941622, 10.2908284297882], 
            [123.881861781196, 10.2907188321084], 
            [123.881990789843, 10.2906704305959], 
            [123.885487886357, 10.2893583593009], 
            [123.879903298798, 10.2866065867246], 
            [123.879773981684, 10.2865428643618], 
            [123.877456937788, 10.2853572305518], 
            [123.875154530357, 10.2864027427924], 
            [123.87437645491, 10.2890344621707], 
            [123.874379827367, 10.2891623457657]
          ]
        ]
      }, 
    "properties" : { "Brgy" : "Mambaling", "level": "low" }
  },
  {
    "type" : "Feature", 
    "geometry" : {
        "type" : "Polygon", 
        "coordinates" : [
          [
            [123.880135539723, 10.3374300886277], 
            [123.884363969422, 10.3410708500397], 
            [123.888122640947, 10.3439512985137], 
            [123.894066770265, 10.3488393278727], 
            [123.896233144444, 10.346469482081], 
            [123.901875321889, 10.3394641887214], 
            [123.899431196593, 10.337287581157], 
            [123.900447734475, 10.334746767949], 
            [123.908390949683, 10.3297007313038], 
            [123.90929463434, 10.3292370615412], 
            [123.907597424781, 10.3258981890502], 
            [123.903887261788, 10.3204238979446], 
            [123.902332677511, 10.3214165336462], 
            [123.901202827748, 10.3208425404509], 
            [123.900869765627, 10.3214869478644], 
            [123.898978978797, 10.3214606966539], 
            [123.893558354734, 10.3216418192146], 
            [123.892695811363, 10.3253977855794], 
            [123.89018727842, 10.3272542290994], 
            [123.88840940507, 10.3271196383607], 
            [123.87986060888, 10.332151916278], 
            [123.880135539723, 10.3374300886277]
          ]
        ]
      }, 
    "properties" : { "Brgy" : "Lahug", "level": "high" }
  },
  {
    "type" : "Feature", 
    "geometry" : {
        "type" : "Polygon", 
        "coordinates" : [
          [
            [123.894550735028, 10.3635659062416], 
            [123.899174316941, 10.3602102146298], 
            [123.913452522116, 10.3502001496172], 
            [123.916002658596, 10.3499194891931], 
            [123.912959313222, 10.3397623589457], 
            [123.911799259728, 10.3402845053257], 
            [123.898500388382, 10.3565524947019], 
            [123.892624361125, 10.3607379934637], 
            [123.894550735028, 10.3635659062416]
          ]
        ]
      }, 
    "properties" : { "Brgy" : "Banilad", "level": "low" }
  }
];

interface FloodMapProps {
  onBarangayClick?: (barangayName: string) => void;
}

export default function FloodMap({ onBarangayClick }: FloodMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [barangayData, setBarangayData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([mod, leafletModule]) => {
      L = leafletModule;
      
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const Map = () => {
        const { MapContainer, TileLayer, GeoJSON } = mod;

        const styleGeoJson = (feature: any) => {
            const level = feature.properties.level as "high" | "medium" | "low";
            
            let color, fillColor, fillOpacity;

            switch (level) {
                case "high":
                    color = '#dc2626';
                    fillColor = '#ef4444';
                    fillOpacity = 0.4;
                    break;
                case "medium":
                    color = '#f97316';
                    fillColor = '#fb923c';
                    fillOpacity = 0.3;
                    break;
                case "low":
                    color = '#3b82f6';
                    fillColor = '#60a5fa';
                    fillOpacity = 0.2;
                    break;
                default:
                    color = '#a0a0a0';
                    fillColor = '#cccccc';
                    fillOpacity = 0.1;
            }

            return {
                fillColor: fillColor,
                weight: 2,
                opacity: 1,
                color: color,
                fillOpacity: fillOpacity,
            };
        };
        
        const onEachFeature = (feature: any, layer: L.Layer) => {
            if (feature.properties && feature.properties.Brgy && feature.properties.level) {
                const levelClass = feature.properties.level === "high" ? "bg-red-600" : feature.properties.level === "medium" ? "bg-orange-600" : "bg-blue-600";

                layer.bindPopup(
                    `<div class="text-center font-medium">
                        Barangay ${feature.properties.Brgy}
                        <div class="mt-2 px-3 py-1 rounded text-white text-xs font-bold ${levelClass}">
                            ${feature.properties.level.toUpperCase()} RISK ZONE
                        </div>
                    </div>`
                );

                // Add click event to the layer
                layer.on('click', () => {
                    if (onBarangayClick && feature.properties.Brgy) {
                        onBarangayClick(feature.properties.Brgy);
                    }
                });

                // Add hover effect
                layer.on('mouseover',  () => {
                    this.setStyle({
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.7
                    });
                });

                layer.on('mouseout',  () => {
                    this.setStyle(styleGeoJson(feature));
                });
            }
        };

        return (
          <MapContainer 
            center={[10.33, 123.88]} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {barangayData.map((feature, index) => (
                <GeoJSON 
                    key={index}
                    data={feature as any} 
                    style={styleGeoJson} 
                    onEachFeature={onEachFeature}
                />
            ))}
            
          </MapContainer>
        );
      };

      setMapComponent(() => Map);
    });
  }, [barangayData, onBarangayClick]);

  useEffect(() => {
    setBarangayData(initialBarangayFeatures);

    const updateTimer = setTimeout(() => {
        const updatedData = initialBarangayFeatures.map(feature => {
            if (!feature.properties) {
                return feature;
            }
            if (feature.properties.Brgy === "Lahug") {
                return { ...feature, properties: { ...feature.properties, level: 'medium' as const } };
            }
            if (feature.properties.Brgy === "Banilad") {
                return { ...feature, properties: { ...feature.properties, level: 'high' as const } };
            }
            return feature;
        });
        
        setBarangayData(updatedData);
        console.log("Flood risk levels dynamically updated after 5 seconds.");
    }, 5000);

    return () => clearTimeout(updateTimer);
  }, []);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-96">
        {MapComponent ? <MapComponent /> : <div className="h-full bg-gray-200 flex items-center justify-center"><p className="text-gray-600">Loading map...</p></div>}

        <div className="absolute top-4 left-4 right-4 z-10">
          <input
            type="text"
            placeholder="Search for specific areas or incidents"
            className="w-full px-4 py-3 rounded-lg bg-white shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div className="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold mb-1">Flood Risk Area Legend</p>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-red-500 mr-2 opacity-50 border border-red-700"></div>
            <span>High Risk Area</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-orange-500 mr-2 opacity-50 border border-orange-700"></div>
            <span>Medium Risk Area</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-blue-500 mr-2 opacity-50 border border-blue-700"></div>
            <span>Low Risk Area</span>
          </div>
        </div>
      </div>
    </Card>
  );
}