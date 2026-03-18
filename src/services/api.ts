import { BarangayFloodData } from "@/src/types/global";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://bahabuster-backend-thesis.onrender.com";

const REPORTS_API_BASE_URL = 
  process.env.NEXT_PUBLIC_REPORTS_API_URL ||
  "https://bahabuster-backend-thesis.onrender.com";

// Log API URLs on load (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:');
  console.log('  - API_BASE_URL:', API_BASE_URL);
  console.log('  - REPORTS_API_BASE_URL:', REPORTS_API_BASE_URL);
  console.log('  - Raw env var:', process.env.NEXT_PUBLIC_API_URL);
}

export async function fetchAllForecasts(): Promise<BarangayFloodData[]> {
  const res = await fetch(`${API_BASE_URL}/predict_all`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const data = await res.json();
  return data.barangays || [];
}

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
  console.log('🌐 Calling login API:', `${API_BASE_URL}/login`);
  console.log('📤 Request body:', { email: credentials.email, password: '***' });
  
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  
  console.log('📡 Login response status:', res.status);
  console.log('📡 Login response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.ok) {
    let errorMessage = `Server returned ${res.status}`;
    try {
      const error = await res.json();
      console.error('❌ Login error response:', error);
      errorMessage = error.message || error.detail || errorMessage;
    } catch (e) {
      console.error('❌ Could not parse error response');
    }
    throw new Error(errorMessage);
  }
  
  const data = await res.json();
  console.log('📦 Raw login response data:', JSON.stringify(data, null, 2));
  console.log('📦 Response keys:', Object.keys(data));
  
  // Validate the response structure
  if (!data) {
    throw new Error('No data received from login API');
  }
  
  // Handle different possible API response formats
  let normalizedResponse: AuthResponse = {};
  
  // Format 1: { message, user, token }
  if (data.user && typeof data.user === 'object') {
    console.log('✅ Found user object in response');
    normalizedResponse = {
      message: data.message,
      user: data.user,
      token: data.token
    };
  }
  // Format 2: User object returned directly (no wrapper)
  else if (data.user_id && data.email && data.name) {
    console.log('✅ Response is a user object directly');
    normalizedResponse = {
      user: data as User,
      token: data.token || undefined,
      message: 'Login successful'
    };
  }
  // Format 3: { data: { user, token } }
  else if (data.data && data.data.user) {
    console.log('✅ Found user in data.data');
    normalizedResponse = {
      message: data.message,
      user: data.data.user,
      token: data.data.token || data.token
    };
  }
  // Unexpected format
  else {
    console.error('⚠️ Unexpected response structure:', Object.keys(data));
    console.error('⚠️ Full response:', data);
    throw new Error(`Unexpected API response format. Keys: ${Object.keys(data).join(', ')}`);
  }
  
  // Final validation
  if (!normalizedResponse.user) {
    throw new Error('Could not extract user data from API response');
  }
  
  console.log('✅ Normalized response:', normalizedResponse);
  return normalizedResponse;
}

export async function signup(data: SignupData): Promise<User> {
  console.log('🌐 Calling signup API:', `${API_BASE_URL}/users`);
  
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  console.log('📡 Signup response status:', res.status);
  
  if (!res.ok) {
    let errorMessage = `Server returned ${res.status}`;
    try {
      const error = await res.json();
      console.error('❌ Signup error response:', error);
      errorMessage = error.message || error.detail || errorMessage;
    } catch (e) {
      console.error('❌ Could not parse error response');
    }
    throw new Error(errorMessage);
  }
  
  const responseData = await res.json();
  console.log('📦 Signup response data:', responseData);
  
  return responseData;
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

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

export interface ReportsResponse {
  reports: Report[];
  total: number;
  barangay: string;
}

export async function getReportsByBarangay(barangay: string): Promise<Report[]> {
  const res = await fetch(`${REPORTS_API_BASE_URL}/reports?barangay=${encodeURIComponent(barangay)}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch reports: ${res.status}`);
  }
  
  const data = await res.json();
  
  // The API returns an array directly, not wrapped in an object
  if (Array.isArray(data)) {
    return data;
  }
  
  return [];
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error.detail || `Server returned ${res.status}`);
  }
  
  return res.json();
}