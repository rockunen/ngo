"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationFormSchema, DonationFormData } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonationFormProps {
  projectId?: string;
  onSuccess?: (donationId: string) => void;
}

export default function DonationForm({
  projectId,
  onSuccess,
}: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
  });

  const customAmount = watch("amount");

  const presetAmounts = [1000, 2000, 5000, 10000, 25000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const onSubmit = async (data: DonationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create donation order
      const createResponse = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: selectedAmount || data.amount,
          projectId,
          donationType: "oneTime",
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Failed to create donation");
      }

      const { order_id, key_id, donation_id, donor_name, donor_email } =
        await createResponse.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: key_id,
        amount: (selectedAmount || data.amount) * 100,
        currency: "INR",
        name: "Save Rana National Trust",
        description: "Donation for Conservation",
        order_id,
        prefill: {
          name: donor_name,
          email: donor_email,
          contact: data.phone,
        },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch("/api/donations/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                donation_id,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Success!
            onSuccess?.(donation_id);
          } catch (error) {
            setError("Payment verification failed. Please contact support.");
            console.error("Verification error:", error);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. Please try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"></h2>

      {error && (
        <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Amount Selection */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-gray-900 mb-4">
          💰 Select Amount (₹)
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-5">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelect(amount)}
              className={`py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 ${
                selectedAmount === amount
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Or enter custom amount"
          {...register("amount", { valueAsNumber: true })}
          min="1"
          step="1"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base font-semibold transition"
        />
        {errors.amount && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          👤 Your Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="10-digit phone number"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PAN Number (for 80G benefits)
            </label>
            <input
              type="text"
              {...register("panNumber")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="Your PAN number"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <details className="mb-8 p-5 bg-gray-50 rounded-lg border-2 border-gray-200 group">
        <summary className="cursor-pointer font-semibold text-gray-900 flex items-center gap-2 hover:text-green-700 transition">
          <span className="text-lg group-open:hidden">➕</span>
          <span className="text-lg hidden group-open:inline">➖</span>
          📍 Address Details (Optional)
        </summary>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <input
            type="text"
            {...register("address")}
            placeholder="Street address"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
          <input
            type="text"
            {...register("city")}
            placeholder="City"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
          <input
            type="text"
            {...register("state")}
            placeholder="State"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
          <input
            type="text"
            {...register("pincode")}
            placeholder="Pincode"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
      </details>

      {/* Message */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          💭 Message (Optional)
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
          placeholder="Share why you're supporting our mission..."
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Donate ₹${selectedAmount || customAmount || 0}`
        )}
      </button>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-blue-900">
          <strong>🛡️ Your donation is secure:</strong> We use industry-standard
          encryption. 100% of your donation goes directly to conservation work.
          You'll receive a tax receipt via email.
        </p>
      </div>
    </form>
  );
}
