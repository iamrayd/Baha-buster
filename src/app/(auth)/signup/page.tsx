"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/src/services/api";
import { Droplet, Mail, Lock, User, MapPin, Eye, EyeOff } from "lucide-react";

const BARANGAYS = [
  "BANILAD", "ERMITA", "MABOLO", "MAMBALING", "SAN ROQUE", "STO. NINO",
  "SUBA", "TEJERO", "TINAGO", "LAHUG", "GUADALUPE", "LABANGON",
  "INAYAWAN", "COGON PARDO", "BULACAO PARDO", "BASAK PARDO", "PARDO POB.",
  "BASAK SAN NICOLAS", "QUIOT PARDO", "PUNTA PRINCESA", "ADLAON", "AGSUNGOT",
  "APAS", "BABAG", "BACAYAN", "BINALIW", "BONBON", "BUDLAAN", "BUHISAN",
  "BUSAY", "CALAMBA", "CAMBINOCOT", "CAPITOL SITE", "CARRETA", "COGON RAMOS",
  "DAY-AS", "GUBA", "HIPODROMO", "KALUBIHAN", "KALUNASAN", "KAMAGAYAN",
  "CAMPUTHAW", "KASAMBAGAN", "KINASANG-AN PARDO", "LOREGA SAN MIGUEL",
  "LUSARAN", "MABINI", "MALUBOG", "PAHINA CENTRAL", "PAHINA SAN NICOLAS",
  "PAMUTAN", "PARIL", "PASIL", "PIT-OS", "PULANGBATO", "PUNG-OL SIBUGAY",
  "SAMBAG I", "SAMBAG II", "SAN ANTONIO", "SAN JOSE", "SANTA CRUZ",
  "SAWANG CALERO", "SINSIN", "SIRAO", "SUDLON I", "SUDLON II", "T. PADILLA",
  "TABUNAN", "TAGBA-O", "TALAMBAN", "TAPTAP", "TISA", "TOONG", "ZAPATERA",
  "SAPANGDAKU", "BUOT-TAUP", "DULJO", "SANTO NIÑO", "SAN NICOLAS CENTRAL",
  "PARIAN", "BARRIO LUZ", "SUBA POBLACION"
].sort();

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    barangay: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const user = await signup({
        email: formData.email,
        name: fullName,
        password: formData.password,
        barangay: formData.barangay,
        role: "admin",
      });

      // The backend string might omit fields, so we guarantee them for the UI session:
      const safeUser = {
        ...user,
        role: "admin",
        created_at: user.created_at || new Date().toISOString(),
      };

      localStorage.setItem("user_data", JSON.stringify(safeUser));
      setSuccess("Successfully created user!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: "var(--radius-input)",
    borderColor: "var(--color-gray-200)",
    background: "var(--color-gray-50)",
    color: "var(--color-gray-700)",
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Branded Panel ──────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "var(--color-primary-dark)" }}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: "var(--color-primary)" }} />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full opacity-5" style={{ background: "#ffffff" }} />

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
            Join your community in staying prepared. Get real-time flood alerts and contribute reports for your barangay.
          </p>
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none">
          <path d="M0 60C240 20 480 100 720 60C960 20 1200 80 1440 50V120H0V60Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* ── Right: Signup Form ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-md w-full animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary-dark)" }}>
              <Droplet size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-gray-700)" }}>Baha-Buster</h1>
              <p className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>Flood Monitoring & Alerts</p>
            </div>
          </div>

          <div className="bg-white p-8" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Create an account</h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>Join Baha-Buster to get real-time flood alerts</p>
            </div>

            {success && (
              <div className="mb-5 p-4 rounded-xl text-sm font-medium" style={{ background: "var(--color-risk-low-bg)", color: "var(--color-risk-low)" }}>
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="mb-5 p-4 rounded-xl text-sm" style={{ background: "var(--color-risk-high-bg)", color: "var(--color-risk-high)" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="firstName">
                    First name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                    <input
                      id="firstName" type="text" placeholder="Juan"
                      value={formData.firstName} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                      style={inputStyle} required disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="lastName">
                    Last name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                    <input
                      id="lastName" type="text" placeholder="Dela Cruz"
                      value={formData.lastName} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                      style={inputStyle} required disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="barangay">
                  Barangay
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                  <select
                    id="barangay" value={formData.barangay} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all appearance-none"
                    style={inputStyle} required disabled={loading}
                  >
                    <option value="">Select your barangay</option>
                    {BARANGAYS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                  <input
                    id="email" type="email" placeholder="juan@example.com"
                    value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                    style={inputStyle} required disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                  <input
                    id="password" type={showPassword ? "text" : "password"}
                    value={formData.password} onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                    style={inputStyle} required disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px"
                style={{
                  borderRadius: "var(--radius-input)",
                  background: loading ? "var(--color-gray-300)" : "var(--color-primary)",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(44, 82, 130, 0.3)",
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "var(--color-gray-500)" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold underline" style={{ color: "var(--color-primary)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}