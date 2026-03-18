"use client"; 

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/src/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    console.log("🔐 Login attempt:", { email, password: "***" });

    try {
      const response = await login({ email, password });
      console.log("✅ Login response:", response);
      
      // Check if we got a valid response
      if (!response) {
        throw new Error("No response from server");
      }

      // Store the token if provided
      if (response.token) {
        console.log("💾 Storing token");
        localStorage.setItem("auth_token", response.token);
      } else {
        console.warn("⚠️ No token in response");
      }
      
      // Store user data - this is critical for logged-in state
      if (response.user) {
        console.log("💾 Storing user data:", response.user);
        localStorage.setItem("user_data", JSON.stringify(response.user));
      } else {
        console.error("❌ No user data in response!");
        throw new Error("Login successful but no user data received");
      }

      // Verify storage
      const storedUser = localStorage.getItem("user_data");
      console.log("✔️ Verification - User data stored:", storedUser ? "YES" : "NO");
      
      if (!storedUser) {
        throw new Error("Failed to store user data");
      }

      console.log("🚀 Redirecting to dashboard...");
      
      // Small delay to ensure localStorage is written
      setTimeout(() => {
        router.push("/dashboard");
        // Force page refresh to ensure components re-check localStorage
        window.location.href = "/dashboard";
      }, 100);
      
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-semibold">⚠️ Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-6">   
          <p className="mt-6 text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/signup" className="text-gray-900 underline hover:text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}