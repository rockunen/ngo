"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Manager {
  id: string;
  email: string;
  full_name: string;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session");

        if (!response.ok) {
          router.push("/manager-login");
          return;
        }

        const data = await response.json();
        if (data.manager) {
          setManager(data.manager);
        } else {
          router.push("/manager-login");
        }
      } catch (err) {
        console.error("Session verification error:", err);
        router.push("/manager-login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  const [stats, setStats] = useState<{
    totalDonationsAmount: number;
    totalDonationsCount: number;
    totalInternsCount: number;
  }>({
    totalDonationsAmount: 0,
    totalDonationsCount: 0,
    totalInternsCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const [donationsRes, internsRes] = await Promise.all([
          fetch("/api/donations/stats"),
          fetch("/api/intern/all"),
        ]);

        let donationsAmount = 0;
        let donationsCount = 0;
        let internsCount = 0;

        if (donationsRes.ok) {
          const donData = await donationsRes.json();
          if (donData.success && donData.data) {
            donationsAmount = donData.data.completed?.totalAmount || 0;
            donationsCount = donData.data.completed?.count || 0;
          }
        }

        if (internsRes.ok) {
          const intData = await internsRes.json();
          if (intData.success && typeof intData.total === "number") {
            internsCount = intData.total;
          } else if (Array.isArray(intData.interns)) {
            internsCount = intData.interns.length;
          }
        }

        setStats({
          totalDonationsAmount: donationsAmount,
          totalDonationsCount: donationsCount,
          totalInternsCount: internsCount,
        });
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (manager) {
      fetchDashboardStats();
    }
  }, [manager]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-pink-600 mb-4">Not authenticated</p>
          <Link
            href="/manager-login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manager Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {manager.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card: Donations */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Donations</h3>
              <span className="text-2xl">💰</span>
            </div>
            {statsLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  ₹{stats.totalDonationsAmount.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {stats.totalDonationsCount} completed donation
                  {stats.totalDonationsCount !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            <Link
              href="/manager-dashboard/donations"
              className="text-blue-600 font-semibold hover:underline"
            >
              View Donations →
            </Link>
          </div>

          {/* Card: Interns */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interns</h3>
              <span className="text-2xl">👥</span>
            </div>
            {statsLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {stats.totalInternsCount}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Registered intern
                  {stats.totalInternsCount !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            <Link
              href="/manager-dashboard/interns"
              className="text-blue-600 font-semibold hover:underline"
            >
              View Interns →
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/manager-dashboard/donations"
              className="block p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                View Donation Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Check donation statistics and trends
              </p>
            </Link>
            <Link
              href="/manager-dashboard/interns"
              className="block p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Manage Interns
              </h3>
              <p className="text-gray-600 text-sm">
                Review and manage intern applications
              </p>
            </Link>
          </div>
        </div>

        {/* Manager Info */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <h3 className="font-semibold text-gray-900 mb-2">Manager Info</h3>
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {manager.full_name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {manager.email}
          </p>
        </div>
      </section>
    </main>
  );
}
