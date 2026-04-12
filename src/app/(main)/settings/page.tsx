"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, MapPin, Mail, Calendar, Shield, AlertTriangle, BarChart3 } from "lucide-react";

interface UserData {
  user_id: number;
  email: string;
  name: string;
  barangay: string;
  role: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user_data");

    if (!userData) {
      // Redirect to login if not logged in
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-12 h-12 border-3 rounded-full animate-spin"
          style={{ borderColor: "var(--color-gray-200)", borderTopColor: "var(--color-primary)" }}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>Profile</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray-400)" }}>
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
      >
        {/* Header gradient */}
        <div
          className="h-32"
          style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)" }}
        />

        {/* Profile content */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
            <div
              className="w-32 h-32 rounded-full bg-white border-4 border-white flex items-center justify-center"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <User size={48} style={{ color: "var(--color-primary)" }} />
            </div>

            <div className="flex-1 sm:mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>{user.name}</h2>
              <p style={{ color: "var(--color-gray-500)" }}>{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Mail, label: "Email Address", value: user.email, iconBg: "rgba(44, 82, 130, 0.1)", iconColor: "var(--color-primary)" },
              { icon: MapPin, label: "Barangay", value: user.barangay, iconBg: "var(--color-risk-low-bg)", iconColor: "var(--color-risk-low)" },
              { icon: Shield, label: "Role", value: user.role.toLowerCase(), iconBg: "rgba(139, 92, 246, 0.1)", iconColor: "var(--color-accent-purple)" },
              { icon: Calendar, label: "Member Since", value: formatDate(user.created_at), iconBg: "var(--color-risk-medium-bg)", iconColor: "var(--color-risk-medium)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4"
                style={{ background: "var(--color-gray-50)", borderRadius: "var(--radius-input)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: item.iconBg }}
                >
                  <item.icon size={20} style={{ color: item.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--color-gray-400)" }}>{item.label}</p>
                  <p className="font-semibold mt-0.5 break-all capitalize" style={{ color: "var(--color-gray-700)" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Account Info */}
          <div
            className="mt-6 p-4"
            style={{
              background: "rgba(44, 82, 130, 0.06)",
              borderRadius: "var(--radius-input)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--color-primary)" }}>
              <strong>Account ID:</strong> #{user.user_id}
            </p>
            <p className="text-xs mt-1 opacity-70" style={{ color: "var(--color-primary)" }}>
              You will receive flood alerts for {user.barangay} area
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/alerts")}
          className="p-6 bg-white text-left group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200"
              style={{ background: "var(--color-risk-high-bg)" }}
            >
              <AlertTriangle size={22} style={{ color: "var(--color-risk-high)" }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--color-gray-700)" }}>View Alerts</h3>
              <p className="text-sm" style={{ color: "var(--color-gray-400)" }}>Check current flood warnings</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="p-6 bg-white text-left group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200"
              style={{ background: "var(--color-risk-low-bg)" }}
            >
              <BarChart3 size={22} style={{ color: "var(--color-risk-low)" }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--color-gray-700)" }}>Dashboard</h3>
              <p className="text-sm" style={{ color: "var(--color-gray-400)" }}>View flood risk analytics</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}