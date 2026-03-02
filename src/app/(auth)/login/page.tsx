"use client"; 

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Can add auth logic here
    console.log("Signing in...");
    
    // Redirects the user to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            Sign In
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