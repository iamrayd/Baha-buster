"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Shield, Map, Search } from "lucide-react";
import { EVACUATION_CENTERS } from "@/src/lib/evacuation-centers";

const HOTLINES = [
  {
    name: "Cebu City Disaster Risk Reduction Management Office (CCDRRMO)",
    number: "(032) 255-8964",
    category: "rescue",
  },
  {
    name: "Emergency Rescue Unit Foundation (ERUF)",
    number: "161",
    category: "medical",
  },
  {
    name: "Cebu City Police Office",
    number: "166 / (032) 233-6793",
    category: "police",
  },
  {
    name: "Bureau of Fire Protection",
    number: "(032) 256-0541",
    category: "fire",
  },
];

const CATEGORY_STYLES: Record<string, { bg: string; color: string; iconBg: string }> = {
  rescue: { bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)", iconBg: "var(--color-risk-medium-bg)" },
  medical: { bg: "var(--color-risk-low-bg)", color: "var(--color-risk-low)", iconBg: "var(--color-risk-low-bg)" },
  police: { bg: "rgba(44, 82, 130, 0.08)", color: "var(--color-primary)", iconBg: "rgba(44, 82, 130, 0.1)" },
  fire: { bg: "var(--color-risk-high-bg)", color: "var(--color-risk-high)", iconBg: "var(--color-risk-high-bg)" },
};



/** Hotlines for the 14 flood-monitored barangays in Cebu City */
const BARANGAY_HOTLINES = [
  { barangay: "Banilad", hotline: "(032) 344-2850" },
  { barangay: "Basak San Nicolas", hotline: "(032) 261-1923" },
  { barangay: "Cogon Pardo", hotline: "(032) 272-0187" },
  { barangay: "Duljo Fatima", hotline: "(032) 256-3041" },
  { barangay: "Ermita", hotline: "(032) 253-7812" },
  { barangay: "Inayawan", hotline: "(032) 272-7134" },
  { barangay: "Mabolo", hotline: "(032) 233-8456" },
  { barangay: "Mambaling", hotline: "(032) 261-5089" },
  { barangay: "Pasil", hotline: "(032) 256-4231" },
  { barangay: "San Roque", hotline: "(032) 255-1467" },
  { barangay: "Sto. Niño", hotline: "(032) 254-6823" },
  { barangay: "Suba", hotline: "(032) 253-9154" },
  { barangay: "Tejero", hotline: "(032) 254-3078" },
  { barangay: "Tinago", hotline: "(032) 253-2196" },
];

export default function ResourcesPage() {
  const router = useRouter();
  const [hotlineSearch, setHotlineSearch] = useState("");

  const filteredBarangayHotlines = BARANGAY_HOTLINES.filter((h) =>
    h.barangay.toLowerCase().includes(hotlineSearch.toLowerCase())
  );

  const handleMapClick = (lat: number, lng: number) => {
    router.push(`/dashboard?lat=${lat}&lng=${lng}&zoom=17&showEvac=true`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Emergency Resources</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
          Important contacts, guides, and preparedness materials.
        </p>
      </div>

      {/* Emergency Hotlines */}
      <div className="bg-white p-6" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-risk-high-bg)" }}
          >
            <Phone size={16} style={{ color: "var(--color-risk-high)" }} />
          </div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>Emergency Hotlines</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOTLINES.map((hotline) => {
            const catStyle = CATEGORY_STYLES[hotline.category] || CATEGORY_STYLES.rescue;
            return (
              <div
                key={hotline.name}
                className="flex items-center justify-between px-4 py-4 transition-all duration-200 hover:shadow-sm"
                style={{
                  background: "var(--color-gray-50)",
                  borderRadius: "var(--radius-input)",
                  borderLeft: `3px solid ${catStyle.color}`,
                }}
              >
                <div>
                  <p className="text-sm font-semibold leading-snug" style={{ color: "var(--color-gray-700)" }}>{hotline.name}</p>
                  <p className="font-bold mt-1" style={{ color: "var(--color-primary)" }}>{hotline.number}</p>
                </div>
                <div
                  className="ml-4 shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: catStyle.iconBg }}
                >
                  <Phone size={16} style={{ color: catStyle.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evacuation Centers + Barangay Hotlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evacuation Centers */}
        <div className="bg-white p-6 flex flex-col h-[480px]" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(44, 82, 130, 0.1)" }}>
              <Shield size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>Evacuation Centers</h2>
          </div>
          <p className="text-xs mb-4 ml-[42px]" style={{ color: "var(--color-gray-400)" }}>Designated safe zones across Cebu City</p>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-1">
            {EVACUATION_CENTERS.map((center) => (
              <div
                key={center.name}
                className="flex items-center justify-between px-4 py-3 transition-all duration-200 hover:shadow-sm"
                style={{
                  background: "var(--color-gray-50)",
                  borderRadius: "var(--radius-input)",
                }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-gray-700)" }}>{center.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-gray-400)" }}>{center.address}</p>
                </div>
                <button
                  onClick={() => handleMapClick(center.lat, center.lng)}
                  className="shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:opacity-80"
                  style={{ color: "var(--color-primary)", background: "rgba(44, 82, 130, 0.08)" }}
                >
                  <Map size={13} />
                  Map
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Barangay Hotlines */}
        <div className="bg-white p-6 flex flex-col h-[480px]" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-risk-medium-bg)" }}>
              <Phone size={16} style={{ color: "var(--color-risk-medium)" }} />
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>Barangay Hotlines</h2>
          </div>
          <p className="text-xs mb-4 ml-[42px]" style={{ color: "var(--color-gray-400)" }}>
            Contact lines for 14 monitored barangays
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-gray-400)" }}
            />
            <input
              type="text"
              placeholder="Search barangay..."
              value={hotlineSearch}
              onChange={(e) => setHotlineSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border outline-none transition-all duration-200 focus:ring-2"
              style={{
                borderColor: "var(--color-gray-200)",
                borderRadius: "var(--radius-input)",
                color: "var(--color-gray-700)",
                background: "var(--color-gray-50)",
              }}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-1">
            {filteredBarangayHotlines.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: "var(--color-gray-400)" }}>
                No matching barangay found.
              </p>
            ) : (
              filteredBarangayHotlines.map((item) => (
                <div
                  key={item.barangay}
                  className="flex items-center justify-between px-4 py-3 transition-all duration-200 hover:shadow-sm"
                  style={{
                    background: "var(--color-gray-50)",
                    borderRadius: "var(--radius-input)",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-gray-700)" }}>{item.barangay}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "var(--color-primary)" }}>{item.hotline}</p>
                  </div>
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-risk-medium-bg)" }}
                  >
                    <Phone size={13} style={{ color: "var(--color-risk-medium)" }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}