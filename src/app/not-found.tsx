import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 text-center">
      <div className="space-y-4 max-w-md animate-fade-in">
        <h1
          className="text-7xl font-extrabold tracking-tight"
          style={{ color: "var(--color-primary-dark)" }}
        >
          404
        </h1>
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-gray-700)" }}>
          Page Not Found
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--color-gray-500)" }}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or it does not exists.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: "var(--color-primary)" }}
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
