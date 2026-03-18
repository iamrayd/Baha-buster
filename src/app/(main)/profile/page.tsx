"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, MapPin, Mail, Calendar, Shield } from "lucide-react";

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

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_token");
    
    // Redirect to login
    router.push("/login");
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your account information and preferences
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 transition-colors shadow-sm font-medium"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        
        {/* Profile content */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <User size={48} className="text-blue-600" />
            </div>
            
            <div className="flex-1 sm:mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-gray-900 font-medium mt-1 break-all">{user.email}</p>
              </div>
            </div>

            {/* Barangay */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Barangay</p>
                <p className="text-gray-900 font-medium mt-1">{user.barangay}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-gray-900 font-medium mt-1 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-gray-900 font-medium mt-1">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Account ID:</strong> #{user.user_id}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You will receive flood alerts for {user.barangay} area
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/alerts")}
          className="p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Alerts</h3>
              <p className="text-sm text-gray-500">Check current flood warnings</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="p-6 bg-white rounded-xl border border-gray-100 hover:border-green-500 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 group-hover:bg-green-600 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dashboard</h3>
              <p className="text-sm text-gray-500">View flood risk analytics</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}