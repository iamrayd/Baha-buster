"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/src/services/api";

// List of barangays from the API data
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const user = await signup({
        email: formData.email,
        name: fullName,
        password: formData.password,
        barangay: formData.barangay,
      });

      // Store user data
      localStorage.setItem("user_data", JSON.stringify(user));

      // Show success message or redirect to login
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Join Baha-Buster to get real-time flood alerts</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Dela Cruz"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="barangay">
              Barangay
            </label>
            <select
              id="barangay"
              value={formData.barangay}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
              disabled={loading}
            >
              <option value="">Select your barangay</option>
              {BARANGAYS.map((barangay) => (
                <option key={barangay} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="juan@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 underline hover:text-blue-600 font-medium ">
             Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}