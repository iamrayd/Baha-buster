"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div 
        className="max-w-md w-full text-center space-y-8 p-10 animate-scale-in"
        style={{ 
          background: "var(--color-card)", 
          borderRadius: "var(--radius-card)", 
          boxShadow: "var(--shadow-elevated)" 
        }}
      >
        <div className="flex justify-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-soft"
            style={{ background: "var(--color-risk-high-bg)" }}
          >
            <AlertOctagon size={40} style={{ color: "var(--color-risk-high)" }} />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-primary-dark)" }}>
            Something went wrong!
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-gray-500)" }}>
            We encountered an unexpected error while processing your request. Please try again or return to the dashboard.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 text-xs text-left bg-gray-50 border border-red-100 rounded-lg overflow-auto max-h-32 text-red-600">
              {error.message || "Unknown error occurred"}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col space-y-3">
          <button 
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "var(--color-primary)" }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200"
            style={{ 
              color: "var(--color-gray-600)", 
              background: "var(--color-gray-100)" 
            }}
          >
            <Home size={16} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
