"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  message: string;
  status: string;
  created_at: string;
  donor_id: string;
  intern_id: string | null;
  referral_code: string | null;
  donors: {
    id: string;
    full_name: string;
    email: string;
  };
  interns: {
    id: string;
    name: string;
  } | null;
}

interface DonationsResponse {
  success: boolean;
  data: Donation[];
  total: number;
  limit: number;
  offset: number;
}

interface ManualDonationForm {
  fullName: string;
  email: string;
  phone: string;
  amount: string;
  referralCode: string;
  message: string;
}

const EMPTY_MANUAL_DONATION_FORM: ManualDonationForm = {
  fullName: "",
  email: "",
  phone: "",
  amount: "",
  referralCode: "",
  message: "",
};

export default function DonationsManagementPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalDonations, setTotalDonations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("completed");
  const [isSessionVerified, setIsSessionVerified] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showManualDonationForm, setShowManualDonationForm] = useState(false);
  const [manualDonationForm, setManualDonationForm] =
    useState<ManualDonationForm>(EMPTY_MANUAL_DONATION_FORM);
  const [manualDonationError, setManualDonationError] = useState<string | null>(
    null
  );
  const [manualDonationSuccess, setManualDonationSuccess] = useState<
    string | null
  >(null);
  const [isAddingManualDonation, setIsAddingManualDonation] = useState(false);
  const [stats, setStats] = useState<{
    completed: { totalAmount: number; averageAmount: number; count: number };
    pending: { count: number };
    failed: { count: number };
    summary: any;
  } | null>(null);

  const fetchDonations = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const offset = (currentPage - 1) * itemsPerPage;
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });

      const search = debouncedSearchTerm.trim();
      if (search) {
        params.set("search", search);
      }

      if (filterStatus !== "all") {
        params.set("status", filterStatus);
      }

      const response = await fetch(`/api/donations/all?${params}`, {
        method: "GET",
        signal,
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
      if (signal?.aborted) {
        return;
      }
      setError(err.message || "Failed to load donations");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [currentPage, debouncedSearchTerm, filterStatus, itemsPerPage, router]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/donations/stats");
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
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

        setIsSessionVerified(true);
      } catch (err) {
        console.error("Session verification error:", err);
        router.push("/manager-login");
      }
    };

    verifySession();
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (!isSessionVerified) {
      return;
    }

    const controller = new AbortController();
    fetchDonations(controller.signal);

    return () => controller.abort();
  }, [fetchDonations, isSessionVerified, refreshKey]);

  useEffect(() => {
    if (isSessionVerified) {
      fetchStats();
    }
  }, [fetchStats, isSessionVerified, refreshKey]);

  const totalPages = Math.ceil(totalDonations / itemsPerPage);

  const handleBack = () => {
    router.push("/manager-dashboard");
  };

  const openManualDonationForm = () => {
    setManualDonationForm(EMPTY_MANUAL_DONATION_FORM);
    setManualDonationError(null);
    setManualDonationSuccess(null);
    setShowManualDonationForm(true);
  };

  const closeManualDonationForm = () => {
    if (isAddingManualDonation) {
      return;
    }

    setShowManualDonationForm(false);
    setManualDonationError(null);
  };

  const handleManualDonationSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setManualDonationError(null);
    setManualDonationSuccess(null);

    const amount = Number(manualDonationForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setManualDonationError("Enter a valid donation amount");
      return;
    }

    setIsAddingManualDonation(true);

    try {
      const response = await fetch("/api/donations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...manualDonationForm,
          amount,
        }),
      });
      const result = await response.json();

      if (response.status === 401) {
        router.push("/manager-login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to add manual donation");
      }

      setManualDonationSuccess("Manual donation added successfully.");
      setShowManualDonationForm(false);
      setManualDonationForm(EMPTY_MANUAL_DONATION_FORM);
      setCurrentPage(1);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setManualDonationError(
        err instanceof Error ? err.message : "Failed to add manual donation"
      );
    } finally {
      setIsAddingManualDonation(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Donations Management
            </h1>
            <button
              type="button"
              onClick={openManualDonationForm}
              className="ml-auto rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
            >
              + Add Manual Donation
            </button>
          </div>
          <p className="text-gray-600">
            Matching Donations:{" "}
            <span className="font-bold">{totalDonations}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
            <p className="text-pink-700">{error}</p>
          </div>
        )}

        {manualDonationSuccess && (
          <div
            className="mb-6 rounded border border-green-200 bg-green-50 p-4"
            role="status"
          >
            <p className="font-semibold text-green-800">
              {manualDonationSuccess}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">
                Total Completed Amount
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{stats.completed.totalAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {stats.completed.count} completed donations
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">
                Average Donation
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                ₹{stats.completed.averageAmount.toFixed(2)}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Per completed donation
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-semibold">
                Pending Donations
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pending.count}
              </p>
              <p className="text-gray-500 text-xs mt-1">Awaiting payment</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
              <p className="text-gray-600 text-sm font-semibold">
                Failed Donations
              </p>
              <p className="text-3xl font-bold text-pink-600 mt-2">
                {stats.failed.count}
              </p>
              <p className="text-gray-500 text-xs mt-1">Payment declined</p>
            </div>
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
                placeholder="Search by donor name, email, referred person, or referral code..."
                value={searchTerm}
                maxLength={200}
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
                <option value="completed">Completed</option>
                <option value="all">All Statuses</option>
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
          ) : donations.length === 0 ? (
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
                        Referred By / Code
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
                    {donations.map((donation) => (
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
                          <div className="font-medium text-gray-800">
                            {donation.interns?.name ||
                              (donation.referral_code ? "Unassigned" : "Direct")}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {donation.referral_code || "No referral code"}
                          </div>
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
                                : "bg-pink-100 text-pink-900"
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
                  Showing {donations.length} of {totalDonations} donations
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
      </section>

      {showManualDonationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-donation-title"
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="manual-donation-title"
              className="text-xl font-bold text-gray-900"
            >
              Add Manual Donation
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Record an offline payment. It will be saved as a completed INR
              donation.
            </p>

            <form
              onSubmit={handleManualDonationSubmit}
              className="mt-6 space-y-4"
            >
              {manualDonationError && (
                <div
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  {manualDonationError}
                </div>
              )}

              <div>
                <label
                  htmlFor="manual-donor-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Donor Name
                </label>
                <input
                  id="manual-donor-name"
                  type="text"
                  value={manualDonationForm.fullName}
                  onChange={(event) =>
                    setManualDonationForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  minLength={2}
                  maxLength={100}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="manual-donor-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Donor Email
                  </label>
                  <input
                    id="manual-donor-email"
                    type="email"
                    value={manualDonationForm.email}
                    onChange={(event) =>
                      setManualDonationForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="manual-donor-phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Donor Phone
                  </label>
                  <input
                    id="manual-donor-phone"
                    type="tel"
                    value={manualDonationForm.phone}
                    onChange={(event) =>
                      setManualDonationForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    minLength={10}
                    maxLength={30}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="manual-donation-amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Amount (INR)
                  </label>
                  <input
                    id="manual-donation-amount"
                    type="number"
                    value={manualDonationForm.amount}
                    onChange={(event) =>
                      setManualDonationForm((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    min="0.01"
                    max="100000000"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="manual-referral-code"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Referral Code (optional)
                  </label>
                  <input
                    id="manual-referral-code"
                    type="text"
                    value={manualDonationForm.referralCode}
                    onChange={(event) =>
                      setManualDonationForm((current) => ({
                        ...current,
                        referralCode: event.target.value.toUpperCase(),
                      }))
                    }
                    maxLength={50}
                    placeholder="INTERN-XXXXXXXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="manual-donation-message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Note (optional)
                </label>
                <textarea
                  id="manual-donation-message"
                  value={manualDonationForm.message}
                  onChange={(event) =>
                    setManualDonationForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeManualDonationForm}
                  disabled={isAddingManualDonation}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingManualDonation}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAddingManualDonation ? "Adding..." : "Add Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
