"use client";

import Link from "next/link";
import { useState } from "react";

export default function InternLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields!");
      return;
    }

    console.log("Intern login:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ email: "", password: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-pink-600/85 to-pink-700/85 text-white py-8 relative"
        style={{
          backgroundImage: "url(/assests/1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/85 to-pink-600/85"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="bg-black/50 p-6 md:p-8 rounded-lg backdrop-blur-sm w-fit mx-auto">
            <h1 className="text-4xl font-bold mb-2">Intern Login</h1>
            <p className="text-lg">Access your intern dashboard</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 text-green-700 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">✓ Login Successful!</h3>
                <p>Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-pink-50 border-2 border-pink-500 text-pink-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Email <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Password <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Login
                </button>

                <div className="text-center text-gray-600 space-y-2">
                  <p>
                    <Link
                      href="#"
                      className="text-pink-500 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                  <p>
                    Don't have an account?{" "}
                    <Link
                      href="/intern-signup"
                      className="text-pink-500 font-semibold hover:underline"
                    >
                      Sign Up Here
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
