"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Intern {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  referral_code: string;
}

interface InternDonation {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  message?: string;
  cause?: string;
  receipt_number?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  donors?: {
    full_name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
  };
}

export default function InternDashboard() {
  const [intern, setIntern] = useState<Intern | null>(null);
  const [donations, setDonations] = useState<InternDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationLink, setDonationLink] = useState<string>("");
  const [selectedDonation, setSelectedDonation] =
    useState<InternDonation | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/intern-verify-session");

        if (!response.ok) {
          router.push("/intern-login");
          return;
        }

        const data = await response.json();
        setIntern(data.intern);

        // Generate full donation link
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        setDonationLink(
          `${baseUrl}/donate?referral=${data.intern.referral_code}`
        );

        // Fetch donations
        const donationsResponse = await fetch("/api/intern/donations");
        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json();
          setDonations(donationsData.donations);
        }
      } catch (err) {
        console.error("Session verification error:", err);
        router.push("/intern-login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  const handleLogout = () => {
    document.cookie = "intern_session=; path=/; max-age=0";
    router.push("/intern-login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </main>
    );
  }

  if (!intern) {
    return null;
  }

  const totalDonations = donations.length;
  const completedDonations = donations.filter(
    (d) => d.status === "completed"
  ).length;
  const totalAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {intern.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Profile Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👤 Your Profile
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-2xl font-bold text-gray-900">{intern.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email Address</p>
              <p className="text-2xl font-bold text-gray-900 break-all">
                {intern.email}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="text-2xl font-bold text-gray-900">{intern.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Member Since</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(intern.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border-2 border-pink-500 p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🔗 Your Referral Code
            </h3>
            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="text-gray-600 text-sm mb-3">
                Share this code with friends and family. When they donate using
                your code, you'll see it tracked in your donations!
              </p>
              <div className="flex items-center gap-3">
                <code className="text-3xl font-bold text-pink-600 flex-1 break-all">
                  {intern.referral_code}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(intern.referral_code);
                    alert("Referral code copied to clipboard!");
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>💡 Donation Link:</strong> Share this link with your
                referral code: {donationLink}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(donationLink);
                  alert("Donation link copied to clipboard!");
                }}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </section>

        {/* Donation Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💰 Donation Statistics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <p className="text-gray-600 text-sm font-semibold">
                Total Donations
              </p>
              <p className="text-4xl font-bold text-pink-600 mt-2">
                {totalDonations}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">
                Completed Donations
              </p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {completedDonations}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">
                Total Amount Donated
              </p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </section>

        {/* Donations List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📋 Your Refered Donations
            </h2>
            <Link
              href="/donate"
              className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-2 rounded-lg font-bold hover:from-pink-600 hover:to-pink-800 transition"
            >
              ❤️ Make a Donation
            </Link>
          </div>

          {donations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                You haven't made any donations yet
              </p>
              <Link
                href="/donate"
                className="inline-block bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-pink-800 transition"
              >
                Start Donating Now
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Cause
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Receipt
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-pink-600">
                          {donation.currency}{" "}
                          {donation.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {donation.cause || "General"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              donation.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : donation.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {donation.status.charAt(0).toUpperCase() +
                              donation.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {donation.receipt_number || "—"}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Donation Details</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-2xl hover:text-pink-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Donor Information */}
              {selectedDonation.donors && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    👤 Donor Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedDonation.donors.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="text-gray-900 font-semibold break-all">
                        {selectedDonation.donors.email}
                      </p>
                    </div>
                    {selectedDonation.donors.phone && (
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedDonation.donors.phone}
                        </p>
                      </div>
                    )}
                    {(selectedDonation.donors.city ||
                      selectedDonation.donors.state) && (
                      <div>
                        <p className="text-gray-600 text-sm">Location</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedDonation.donors.city}
                          {selectedDonation.donors.city &&
                          selectedDonation.donors.state
                            ? ", "
                            : ""}
                          {selectedDonation.donors.state}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Donation ID</p>
                  <code className="text-sm bg-gray-100 p-2 rounded block break-all">
                    {selectedDonation.id}
                  </code>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Amount</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {selectedDonation.currency}{" "}
                    {selectedDonation.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Cause and Message */}
              <div className="border-t pt-4">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Cause/Project</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedDonation.cause || "General Donation"}
                  </p>
                </div>
                {selectedDonation.message && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Donor's Message
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-gray-900 italic">
                        "{selectedDonation.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Dates */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Status</p>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                      selectedDonation.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : selectedDonation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedDonation.status.charAt(0).toUpperCase() +
                      selectedDonation.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedDonation.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Receipt and Payment Info */}
              {selectedDonation.receipt_number && (
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Receipt Number</p>
                  <code className="bg-gray-100 p-3 rounded block break-all font-mono text-sm">
                    {selectedDonation.receipt_number}
                  </code>
                </div>
              )}

              {selectedDonation.razorpay_payment_id && (
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">
                      Razorpay Payment ID
                    </p>
                    <code className="bg-gray-100 p-2 rounded block break-all text-xs">
                      {selectedDonation.razorpay_payment_id}
                    </code>
                  </div>
                  {selectedDonation.razorpay_order_id && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Razorpay Order ID
                      </p>
                      <code className="bg-gray-100 p-2 rounded block break-all text-xs">
                        {selectedDonation.razorpay_order_id}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4 flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDonation.id);
                    alert("Donation ID copied!");
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  📋 Copy ID
                </button>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
