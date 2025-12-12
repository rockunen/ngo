"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  message: string;
  status: string;
  created_at: string;
  donor_id: string;
  donors: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface DonationsResponse {
  success: boolean;
  data: Donation[];
  total: number;
  limit: number;
  offset: number;
}

export default function DonationsManagementPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalDonations, setTotalDonations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Verify manager session using server-side endpoint
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session");

        if (!response.ok) {
          router.push("/manager-login");
          return;
        }

        const data = await response.json();
        if (!data.manager) {
          router.push("/manager-login");
          return;
        }

        // Session is valid, fetch donations
        fetchDonations();
      } catch (err) {
        console.error("Session verification error:", err);
        router.push("/manager-login");
      }
    };

    verifySession();
  }, [router]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const offset = (currentPage - 1) * itemsPerPage;
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`/api/donations/all?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/manager-login");
          return;
        }
        throw new Error("Failed to fetch donations");
      }

      const data: DonationsResponse = await response.json();
      setDonations(data.data);
      setTotalDonations(data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donors.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      donation.donors.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(totalDonations / itemsPerPage);

  const handleBack = () => {
    router.push("/manager-dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Donations Management
            </h1>
          </div>
          <p className="text-gray-600">
            Total Donations: <span className="font-bold">{totalDonations}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Donations
              </label>
              <input
                type="text"
                placeholder="Search by donor name, email, or project..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donations...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No donations found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {donation.donors?.full_name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {donation.donors?.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          {donation.currency} {donation.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(donation.created_at).toLocaleDateString()}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredDonations.length} of {totalDonations}{" "}
                  donations
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Donations
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalDonations}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              This Page Amount
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {filteredDonations
                .reduce((sum, d) => sum + d.amount, 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Average Donation
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {filteredDonations.length > 0
                ? (
                    filteredDonations.reduce((sum, d) => sum + d.amount, 0) /
                    filteredDonations.length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
