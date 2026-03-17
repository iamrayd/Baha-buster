import { Phone, Shield, BookOpen, FileText, Download, Map } from "lucide-react";

const HOTLINES = [
  {
    name: "Cebu City Disaster Risk Reduction Management Office (CCDRRMO)",
    number: "(032) 255-8964",
  },
  {
    name: "Emergency Rescue Unit Foundation (ERUF)",
    number: "161",
  },
  {
    name: "Cebu City Police Office",
    number: "166 / (032) 233-6793",
  },
  {
    name: "Bureau of Fire Protection",
    number: "(032) 256-0541",
  },
];

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
        <h1 className="text-3xl font-bold text-gray-900">Emergency Resources</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Important contacts, guides, and preparedness materials.
        </p>
      </div>

      {/* Emergency Hotlines */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Phone size={18} className="text-blue-500" />
          <h2 className="text-base font-semibold text-blue-500">Emergency Hotlines</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOTLINES.map((hotline) => (
            <div
              key={hotline.name}
              className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-100 px-4 py-4"
            >
              <div>
                <p className="text-sm text-gray-700 font-medium leading-snug">{hotline.name}</p>
                <p className="text-blue-500 font-bold mt-1">{hotline.number}</p>
              </div>
              <div className="ml-4 shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <Phone size={16} className="text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evacuation Centers + Preparedness Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Evacuation Centers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={17} className="text-blue-600" />
            <h2 className="text-base font-semibold text-blue-600">Evacuation Centers</h2>
          </div>
          <p className="text-xs text-gray-500 mb-5">Designated safe zones across Cebu City</p>

          <div className="flex-1 divide-y divide-gray-100">
            {EVACUATION_CENTERS.map((center) => (
              <div key={center.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{center.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{center.address}</p>
                </div>
                <button className="text-xs text-gray-500 font-medium flex items-center gap-1 hover:text-blue-600 transition-colors shrink-0 ml-4">
                  <Map size={13} />
                  Map
                </button>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full border border-blue-500 text-blue-600 text-sm font-medium rounded-lg py-2.5 hover:bg-blue-50 transition-colors">
            View Full Directory
          </button>
        </div>

        {/* Preparedness Guides */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={17} className="text-blue-600" />
            <h2 className="text-base font-semibold text-blue-600">Preparedness Guides</h2>
          </div>
          <p className="text-xs text-gray-500 mb-5">Downloadable resources for your family</p>

          <div className="space-y-2">
            {GUIDES.map((guide) => (
              <div
                key={guide}
                className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText size={15} className="text-blue-400 shrink-0" />
                  <span className="text-sm text-gray-700">{guide}</span>
                </div>
                <button className="ml-3 shrink-0 text-gray-400 hover:text-blue-600 transition-colors">
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