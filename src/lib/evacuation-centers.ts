/** Evacuation centers across the 14 flood-monitored barangays of Cebu City */
export interface EvacuationCenter {
  name: string;
  address: string;
  barangay: string;
  lat: number;
  lng: number;
}

export const EVACUATION_CENTERS: EvacuationCenter[] = [
  // Banilad
  { name: "Banilad Elementary School", address: "Gov. M. Cuenco Ave, Banilad", barangay: "Banilad", lat: 10.3530, lng: 123.9060 },
  // Basak San Nicolas
  { name: "Basak San Nicolas Barangay Hall", address: "Basak San Nicolas, Cebu City", barangay: "Basak San Nicolas", lat: 10.2905, lng: 123.8700 },
  // Cogon Pardo
  { name: "Cogon Pardo Elementary School", address: "Cogon Pardo, Cebu City", barangay: "Cogon Pardo", lat: 10.2780, lng: 123.8610 },
  // Duljo Fatima
  { name: "Duljo Fatima Barangay Hall", address: "Duljo Fatima, Cebu City", barangay: "Duljo Fatima", lat: 10.2910, lng: 123.8970 },
  // Ermita
  { name: "Cebu City Sports Center", address: "Osmeña Blvd, Ermita", barangay: "Ermita", lat: 10.2935, lng: 123.8985 },
  // Inayawan
  { name: "Inayawan Barangay Hall", address: "Inayawan, Cebu City", barangay: "Inayawan", lat: 10.2660, lng: 123.8610 },
  // Mabolo
  { name: "Mabolo Elementary School", address: "Mabolo, Cebu City", barangay: "Mabolo", lat: 10.3170, lng: 123.9150 },
  // Mambaling
  { name: "Mambaling Community Center", address: "Mambaling, Cebu City", barangay: "Mambaling", lat: 10.2880, lng: 123.8790 },
  // Pasil
  { name: "Pasil Fish Market Covered Court", address: "Pasil, Cebu City", barangay: "Pasil", lat: 10.2945, lng: 123.8960 },
  // San Roque
  { name: "San Roque Barangay Hall", address: "San Roque, Cebu City", barangay: "San Roque", lat: 10.2960, lng: 123.9000 },
  // Sto. Niño
  { name: "Sto. Niño Parish Covered Court", address: "Sto. Niño, Cebu City", barangay: "Sto. Niño", lat: 10.2940, lng: 123.8950 },
  // Suba
  { name: "Suba Barangay Hall", address: "Suba, Cebu City", barangay: "Suba", lat: 10.2945, lng: 123.8920 },
  // Tejero
  { name: "Tejero Elementary School", address: "Tejero, Cebu City", barangay: "Tejero", lat: 10.3060, lng: 123.8980 },
  // Tinago
  { name: "Tinago Barangay Hall", address: "Tinago, Cebu City", barangay: "Tinago", lat: 10.2990, lng: 123.8930 },
  // City-wide centers
  { name: "Abellana National School", address: "Jones Ave, Cebu City", barangay: "City-wide", lat: 10.3050, lng: 123.8916 },
  { name: "Barangay Guadalupe Sports Complex", address: "Guadalupe, Cebu City", barangay: "City-wide", lat: 10.3170, lng: 123.8790 },
];
