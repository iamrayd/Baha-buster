import { Phone, Shield, BookOpen, FileText, Download, Map } from "lucide-react";

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
  rescue:  { bg: "var(--color-risk-medium-bg)", color: "var(--color-risk-medium)", iconBg: "var(--color-risk-medium-bg)" },
  medical: { bg: "var(--color-risk-low-bg)",    color: "var(--color-risk-low)",    iconBg: "var(--color-risk-low-bg)" },
  police:  { bg: "rgba(44, 82, 130, 0.08)",     color: "var(--color-primary)",     iconBg: "rgba(44, 82, 130, 0.1)" },
  fire:    { bg: "var(--color-risk-high-bg)",   color: "var(--color-risk-high)",   iconBg: "var(--color-risk-high-bg)" },
};

const EVACUATION_CENTERS = [
  { name: "Abellana National School", address: "Jones Ave, Cebu City" },
  { name: "Cebu City Sports Center", address: "Osmeña Blvd" },
  { name: "Barangay Guadalupe Sports Complex", address: "Guadalupe, Cebu City" },
];

const GUIDES = [
  "72-Hour Emergency Go-Bag Checklist",
  "Flood Response Protocol for Households",
  "First Aid Quick Reference Guide",
  "Post-Flood Cleaning and Sanitation",
];

export default function ResourcesPage() {
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

      {/* Evacuation Centers + Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evacuation Centers */}
        <div className="bg-white p-6 flex flex-col" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(44, 82, 130, 0.1)" }}>
              <Shield size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>Evacuation Centers</h2>
          </div>
          <p className="text-xs mb-5 ml-[42px]" style={{ color: "var(--color-gray-400)" }}>Designated safe zones across Cebu City</p>

          <div className="flex-1 divide-y" style={{ borderColor: "var(--color-gray-100)" }}>
            {EVACUATION_CENTERS.map((center) => (
              <div key={center.name} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-gray-700)" }}>{center.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-gray-400)" }}>{center.address}</p>
                </div>
                <button className="text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ml-4 hover:opacity-80" style={{ color: "var(--color-primary)" }}>
                  <Map size={13} />
                  Map
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-5 w-full border text-sm font-semibold py-2.5 transition-all duration-200 hover:shadow-sm hover:-translate-y-px"
            style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", borderRadius: "var(--radius-button)" }}
          >
            View Full Directory
          </button>
        </div>

        {/* Preparedness Guides */}
        <div className="bg-white p-6" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-risk-low-bg)" }}>
              <BookOpen size={16} style={{ color: "var(--color-risk-low)" }} />
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-gray-700)" }}>Preparedness Guides</h2>
          </div>
          <p className="text-xs mb-5 ml-[42px]" style={{ color: "var(--color-gray-400)" }}>Downloadable resources for your family</p>

          <div className="space-y-2">
            {GUIDES.map((guide) => (
              <div
                key={guide}
                className="flex items-center justify-between px-4 py-3.5 transition-all duration-200 hover:shadow-sm"
                style={{ background: "var(--color-gray-50)", borderRadius: "var(--radius-input)" }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={15} className="shrink-0" style={{ color: "var(--color-primary)" }} />
                  <span className="text-sm" style={{ color: "var(--color-gray-700)" }}>{guide}</span>
                </div>
                <button className="ml-3 shrink-0 transition-colors hover:opacity-70" style={{ color: "var(--color-gray-400)" }}>
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}