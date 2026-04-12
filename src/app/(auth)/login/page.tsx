"use client"; 

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/src/services/api";
import { Droplet, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    console.log("🔐 Login attempt:", { email, password: "***" });

    try {
      const response = await login({ email, password });
      console.log("✅ Login response:", response);
      
      if (!response) {
        throw new Error("No response from server");
      }

      if (response.token) {
        console.log("💾 Storing token");
        localStorage.setItem("auth_token", response.token);
      } else {
        console.warn("⚠️ No token in response");
      }
      
      if (response.user) {
        console.log("💾 Storing user data:", response.user);
        localStorage.setItem("user_data", JSON.stringify(response.user));
      } else {
        console.error("❌ No user data in response!");
        throw new Error("Login successful but no user data received");
      }

      const storedUser = localStorage.getItem("user_data");
      console.log("✔️ Verification - User data stored:", storedUser ? "YES" : "NO");
      
      if (!storedUser) {
        throw new Error("Failed to store user data");
      }

      console.log("🚀 Redirecting to dashboard...");
      
      setTimeout(() => {
        router.push("/dashboard");
        window.location.href = "/dashboard";
      }, 100);
      
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Branded Panel ──────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "var(--color-primary-dark)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: "var(--color-primary)" }} />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full opacity-5" style={{ background: "#ffffff" }} />
        <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full opacity-5" style={{ background: "#ffffff" }} />

        <div className="relative z-10 text-center px-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <Droplet size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Baha-Buster</h1>
          <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            Flood Monitoring & Alert System
          </p>
          <div className="w-16 h-1 rounded-full mx-auto mt-6 mb-6" style={{ background: "rgba(255,255,255,0.2)" }} />
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Real-time flood risk predictions and community alerts for Cebu City barangays, powered by AI.
          </p>
        </div>

        {/* Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60C240 20 480 100 720 60C960 20 1200 80 1440 50V120H0V60Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      {/* ── Right: Login Form ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-md w-full animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary-dark)" }}
            >
              <Droplet size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-gray-700)" }}>Baha-Buster</h1>
              <p className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>Flood Monitoring & Alerts</p>
            </div>
          </div>

          <div className="bg-white p-8" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Welcome back</h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>Sign in to your account</p>
            </div>

            {error && (
              <div
                className="mb-5 p-4 rounded-xl text-sm flex items-start gap-3"
                style={{ background: "var(--color-risk-high-bg)", color: "var(--color-risk-high)" }}
              >
                <span className="text-base">⚠️</span>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderRadius: "var(--radius-input)",
                      borderColor: "var(--color-gray-200)",
                      background: "var(--color-gray-50)",
                      color: "var(--color-gray-700)",
                    }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold" style={{ color: "var(--color-gray-600)" }} htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderRadius: "var(--radius-input)",
                      borderColor: "var(--color-gray-200)",
                      background: "var(--color-gray-50)",
                      color: "var(--color-gray-700)",
                    }}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-gray-400)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px mt-2"
                style={{
                  borderRadius: "var(--radius-input)",
                  background: loading ? "var(--color-gray-300)" : "var(--color-primary)",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(44, 82, 130, 0.3)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "var(--color-gray-500)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold underline transition-colors" style={{ color: "var(--color-primary)" }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}