import { BarangayFloodData } from "@/src/types/global";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

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
  password_hash: string;
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error.detail || `Server returned ${res.status}`);
  }
  
  return res.json();
}

export async function signup(data: SignupData): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error.detail || `Server returned ${res.status}`);
  }
  
  return res.json();
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}