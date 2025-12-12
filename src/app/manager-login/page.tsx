"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/manager-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push("/manager-dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen ">
      {/* Hero Section */}
      <section
        className="relative py-16 overflow-hidden"
        style={{
          backgroundImage: "url(/assests/4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-orange-700/90"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Manager Login
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50">
              Secure Access to Your Dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur p-10 rounded-2xl shadow-2xl border border-emerald-200">
            {submitted ? (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 text-emerald-700 p-8 rounded-xl text-center space-y-3">
                <h3 className="text-3xl font-bold">✓ Login Successful!</h3>
                <p className="text-emerald-600">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 text-red-700 p-4 rounded-lg font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block font-semibold text-orange-900">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:cursor-not-allowed transition duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:cursor-not-allowed transition duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="pt-4 border-t border-slate-200 text-center">
                  <p className="text-slate-600 mb-2">
                    <Link
                      href="#"
                      className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
