import { BarangayFloodData } from "@/src/types/global";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://bahabuster-backend-thesis.onrender.com";

const REPORTS_API_BASE_URL =
  process.env.NEXT_PUBLIC_REPORTS_API_URL ||
  "https://bahabuster-backend-thesis.onrender.com";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔧 API Configuration:");
  console.log("  - API_BASE_URL:", API_BASE_URL);
  console.log("  - REPORTS_API_BASE_URL:", REPORTS_API_BASE_URL);
}

// ─── Forecasts ────────────────────────────────────────────────────────────────

export async function fetchAllForecasts(): Promise<BarangayFloodData[]> {
  const res = await fetch(`${API_BASE_URL}/predict_all`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const data = await res.json();
  return data.barangays || [];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
  barangay: string;
}

export interface User {
  user_id: number;
  email: string;
  name: string;
  barangay: string;
  password_hash?: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
  token?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    let errorMessage = `Server returned ${res.status}`;
    try {
      const error = await res.json();
      errorMessage = error.message || error.detail || errorMessage;
    } catch {
      // response body was not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  if (!data) throw new Error("No data received from login API");

  let normalizedResponse: AuthResponse = {};

  if (data.user && typeof data.user === "object") {
    normalizedResponse = { message: data.message, user: data.user, token: data.token };
  } else if (data.user_id && data.email && data.name) {
    normalizedResponse = { user: data as User, token: data.token, message: "Login successful" };
  } else if (data.data?.user) {
    normalizedResponse = {
      message: data.message,
      user: data.data.user,
      token: data.data.token ?? data.token,
    };
  } else {
    throw new Error(`Unexpected API response format. Keys: ${Object.keys(data).join(", ")}`);
  }

  if (!normalizedResponse.user) throw new Error("Could not extract user data from API response");
  return normalizedResponse;
}

export async function signup(data: SignupData): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = `Server returned ${res.status}`;
    try {
      const error = await res.json();
      errorMessage = error.message || error.detail || errorMessage;
    } catch {
      // response body was not JSON
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertSeverity = "low" | "moderate" | "high" | "critical";
export type AlertStatus   = "active" | "resolved" | "inactive";

export interface CreateAlertPayload {
  title: string;
  location: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  acknowledged: boolean;
}

export interface AlertRecord extends CreateAlertPayload {
  alert_id: number;
  created_at: string;
}

export async function createAlert(payload: CreateAlertPayload): Promise<AlertRecord> {
  const res = await fetch(`${API_BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = `Server returned ${res.status}`;
    try {
      const error = await res.json();
      errorMessage = error.message || error.detail || errorMessage;
    } catch {
      // response body was not JSON
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  report_id: number;
  severity: string;
  description: string;
  photos: string[];
  user_barangay: string;
  user_email: string;
  timestamp: string;
  created_at: string;
}

// Every barangay available in the system.
const ALL_BARANGAYS = [
  "ADLAON", "AGSUNGOT", "APAS", "BABAG", "BACAYAN", "BANILAD", "BARRIO LUZ",
  "BASAK PARDO", "BASAK SAN NICOLAS", "BINALIW", "BONBON", "BUDLAAN",
  "BUHISAN", "BULACAO PARDO", "BUSAY", "BUOT-TAUP", "CALAMBA", "CAMBINOCOT",
  "CAMPUTHAW", "CAPITOL SITE", "CARRETA", "COGON PARDO", "COGON RAMOS",
  "DAY-AS", "DULJO", "ERMITA", "GUBA", "GUADALUPE", "HIPODROMO", "INAYAWAN",
  "KALUBIHAN", "KALUNASAN", "KAMAGAYAN", "KASAMBAGAN", "KINASANG-AN PARDO",
  "LABANGON", "LAHUG", "LOREGA SAN MIGUEL", "LUSARAN", "MABINI", "MABOLO",
  "MALUBOG", "MAMBALING", "PAHINA CENTRAL", "PAHINA SAN NICOLAS", "PAMUTAN",
  "PARIAN", "PARIL", "PASIL", "PIT-OS", "PULANGBATO", "PUNG-OL SIBUGAY",
  "PUNTA PRINCESA", "PARDO POB.", "QUIOT PARDO", "SAMBAG I", "SAMBAG II",
  "SAN ANTONIO", "SAN JOSE", "SAN NICOLAS CENTRAL", "SAN ROQUE",
  "SANTA CRUZ", "SAPANGDAKU", "SAWANG CALERO", "SINSIN", "SIRAO",
  "STO. NINO", "SUBA", "SUDLON I", "SUDLON II", "T. PADILLA", "TABUNAN",
  "TAGBA-O", "TALAMBAN", "TAPTAP", "TEJERO", "TINAGO", "TISA", "TOONG",
  "ZAPATERA",
];

export async function getReportsByBarangay(barangay: string): Promise<Report[]> {
  const res = await fetch(
    `${REPORTS_API_BASE_URL}/reports?barangay=${encodeURIComponent(barangay)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getAllReports(): Promise<Report[]> {
  const results = await Promise.allSettled(
    ALL_BARANGAYS.map((barangay) =>
      fetch(
        `${REPORTS_API_BASE_URL}/reports?barangay=${encodeURIComponent(barangay)}`
      ).then((res) => {
        if (!res.ok) return [] as Report[];
        return res.json().then((data: unknown) =>
          Array.isArray(data) ? (data as Report[]) : []
        );
      })
    )
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

export async function createReport(reportData: {
  user_id: number;
  barangay: string;
  report_type: string;
  description: string;
  location?: string;
  severity?: string;
}): Promise<Report> {
  const res = await fetch(`${REPORTS_API_BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error.detail || `Server returned ${res.status}`);
  }

  return res.json();
}