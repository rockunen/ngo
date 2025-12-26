"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { internSignupSchema, InternSignupData } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InternSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [donationLink, setDonationLink] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InternSignupData>({
    resolver: zodResolver(internSignupSchema),
  });

  const onSubmit = async (data: InternSignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/intern-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      // Store session token in cookie
      document.cookie = `intern_session=${
        result.session_token
      }; path=/; max-age=${30 * 24 * 60 * 60}`;

      // Show success with referral code
      setReferralCode(result.referral_code);
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      setDonationLink(`${baseUrl}/donate?referral=${result.referral_code}`);
      setSignupSuccess(true);

      // Auto redirect after 5 seconds
      setTimeout(() => {
        router.push("/intern-dashboard");
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess && referralCode && donationLink) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Created!
            </h1>
            <p className="text-gray-600">Welcome to Get Wish Foundation</p>
          </div>

          <div className="space-y-6">
            <div className="bg-pink-50 border-2 border-pink-500 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Your Referral Code:</p>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-bold text-pink-600 flex-1 break-all">
                  {referralCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    alert("Referral code copied!");
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded font-semibold text-sm transition whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900 mb-3">
                <strong>💡 Donation Link:</strong> Share this link with your
                friends and family:
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 mb-3 break-all text-xs font-mono">
                {donationLink}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(donationLink);
                  alert("Donation link copied to clipboard!");
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
              >
                📋 Copy Full Link
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                Redirecting to dashboard in 5 seconds...
              </p>
              <Link
                href="/intern-dashboard"
                className="inline-block bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-pink-800 transition"
              >
                Go to Dashboard Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Us Today
          </h1>
          <p className="text-gray-600">Create your intern account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="10 digit mobile number"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-pink-800 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/intern-login"
            className="text-pink-600 font-semibold hover:text-pink-700"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
