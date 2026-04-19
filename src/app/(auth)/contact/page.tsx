"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Droplet, Mail, User, MapPin, MessageSquare, Building2, ShieldCheck, Lock, ArrowLeft } from "lucide-react";

const ADMIN_PASSWORD = "bahaadmin";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactPerson: "",
    email: "",
    barangay: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  // Admin gate
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`[Baha-Buster] Account Request – ${formData.barangay}`);
    const body = encodeURIComponent(
      `Contact Person: ${formData.contactPerson}\n` +
      `Email: ${formData.email}\n` +
      `Barangay: ${formData.barangay}\n\n` +
      `Message:\n${formData.message}`
    );

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=imandingal@gmail.com&su=${subject}&body=${body}`, "_blank");
    setSent(true);
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      router.push("/signup");
    } else {
      setAdminError("Invalid password");
      setTimeout(() => setAdminError(""), 2000);
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
        <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full opacity-5" style={{ background: "#ffffff" }} />

        <div className="relative z-10 text-center px-12">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-white overflow-hidden shadow-lg border-4 border-white/20"
          >
            <img src="/images/baha-buster-logo.png" alt="Baha-Buster Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Baha-Buster</h1>
          <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            Flood Monitoring & Alert System
          </p>
          <div className="w-16 h-1 rounded-full mx-auto mt-6 mb-6" style={{ background: "rgba(255,255,255,0.2)" }} />
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Accounts are provisioned by the Baha-Buster team to ensure legitimacy and prevent false alerts. Contact us to get started.
          </p>
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none">
          <path d="M0 60C240 20 480 100 720 60C960 20 1200 80 1440 50V120H0V60Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* ── Right: Contact Form ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-md w-full animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white overflow-hidden shadow-sm shrink-0 border border-gray-100">
              <img src="/images/baha-buster-logo.png" alt="Baha-Buster Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-gray-700)" }}>Baha-Buster</h1>
              <p className="text-[11px]" style={{ color: "var(--color-gray-400)" }}>Flood Monitoring & Alerts</p>
            </div>
          </div>

          <div className="bg-white p-8" style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}>
            {!sent ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Request an Account</h2>
                  <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
                    Accounts are managed by the Baha-Buster team. Fill out this form and we&apos;ll get back to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="contactPerson">
                      Contact Person
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                      <input
                        id="contactPerson" type="text" placeholder="Juan Dela Cruz"
                        value={formData.contactPerson} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                        style={inputStyle} required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                      <input
                        id="email" type="email" placeholder="you@lgu.gov.ph"
                        value={formData.email} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                        style={inputStyle} required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="barangay">
                      Barangay
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                      <input
                        id="barangay" type="text" placeholder="e.g. Mabolo, Banilad"
                        value={formData.barangay} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
                        style={inputStyle} required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-gray-600)" }} htmlFor="message">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-4 top-3.5" style={{ color: "var(--color-gray-400)" }} />
                      <textarea
                        id="message" rows={3} placeholder="Tell us why you need access..."
                        value={formData.message} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all resize-none"
                        style={inputStyle} required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white font-semibold py-3 transition-all duration-200 hover:-translate-y-px mt-2"
                    style={{
                      borderRadius: "var(--radius-input)",
                      background: "var(--color-primary)",
                      boxShadow: "0 2px 8px rgba(44, 82, 130, 0.3)",
                    }}
                  >
                    Send Request
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--color-risk-low-bg)" }}
                >
                  <Mail size={28} style={{ color: "var(--color-risk-low)" }} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-gray-700)" }}>
                  Request Sent!
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-gray-400)" }}>
                  Your email client should have opened with the request details. We&apos;ll review and get back to you shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm font-semibold underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Send another request
                </button>
              </div>
            )}

            {/* Back to login + Admin gate */}
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm" style={{ color: "var(--color-gray-500)" }}>
                <Link href="/login" className="font-semibold inline-flex items-center gap-1 transition-colors" style={{ color: "var(--color-primary)" }}>
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </p>

              <div className="border-t pt-3" style={{ borderColor: "var(--color-gray-100)" }}>
                {!showAdminGate ? (
                  <button
                    onClick={() => setShowAdminGate(true)}
                    className="w-full text-center text-xs font-medium flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ color: "var(--color-gray-400)" }}
                  >
                    <ShieldCheck size={13} />
                    Admin Access
                  </button>
                ) : (
                  <form onSubmit={handleAdminAccess} className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray-400)" }} />
                      <input
                        type="password"
                        placeholder="Admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border focus:outline-none focus:ring-2 transition-all"
                        style={inputStyle}
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
                      style={{ background: "var(--color-primary)", borderRadius: "var(--radius-input)" }}
                    >
                      Go
                    </button>
                  </form>
                )}
                {adminError && (
                  <p className="text-xs mt-1.5 text-center font-medium" style={{ color: "var(--color-risk-high)" }}>
                    {adminError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
