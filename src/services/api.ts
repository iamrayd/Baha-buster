import { BarangayFloodData } from "@/src/types/global";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://bahabuster-backend.onrender.com/forecasts/all";

export async function fetchAllForecasts(): Promise<BarangayFloodData[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}