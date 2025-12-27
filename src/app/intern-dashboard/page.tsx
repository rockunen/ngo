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
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export default function InternDashboard() {
  const [intern, setIntern] = useState<Intern | null>(null);
  const [donations, setDonations] = useState<InternDonation[]>([]);
  const [loading, setLoading] = useState(true);
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
                referral code:{" "}
                {typeof window !== "undefined"
                  ? `${window.location.origin}/donate?referral=${intern.referral_code}`
                  : ""}
              </p>
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
              📋 Your Donations
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
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
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
                          ₹{donation.amount.toLocaleString("en-IN")}
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
                          {new Date(donation.created_at).toLocaleDateString()}
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
    </main>
  );
}
