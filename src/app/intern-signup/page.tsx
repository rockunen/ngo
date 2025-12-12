"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InternSignupPage() {
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    phone: "",
    college: "",
    course: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    console.log("Intern signup:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        fname: "",
        email: "",
        password: "",
        confirmPassword: "",
        designation: "",
        phone: "",
        college: "",
        course: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8 relative"
        style={{
          backgroundImage: "url(/assests/2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/85 to-red-600/85"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="bg-black/50 p-6 md:p-8 rounded-lg backdrop-blur-sm w-fit mx-auto">
            <h1 className="text-4xl font-bold mb-2">Intern Registration</h1>
            <p className="text-lg">Join our community of changemakers</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 text-green-700 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">
                  ✓ Registration Successful!
                </h3>
                <p className="mb-4">
                  Your account has been created. You can now login.
                </p>
                <Link
                  href="/intern-login"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      College/University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="Enter your college/university name"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Course/Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Tech, B.A, M.Sc"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password (min 6 characters)"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Sign Up
                </button>

                <div className="text-center text-gray-600">
                  <p>
                    Already have an account?{" "}
                    <Link
                      href="/intern-login"
                      className="text-orange-500 font-semibold hover:underline"
                    >
                      Login Here
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
