"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DonationResponse {
  success: boolean;
  order_id: string;
  amount: number;
  key_id: string;
  donor_name: string;
  donor_email: string;
  donation_id: string;
}

export function useDonation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createDonation = useCallback(
    async (formData: any): Promise<DonationResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/donations/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create donation");
        }

        const data: DonationResponse = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyPayment = useCallback(
    async (
      orderId: string,
      paymentId: string,
      signature: string,
      donationId: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/donations/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            payment_id: paymentId,
            signature,
            donation_id: donationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        const data = await response.json();
        if (data.success) {
          router.push("/donate/success");
        }
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Verification failed";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    isLoading,
    error,
    createDonation,
    verifyPayment,
    clearError: () => setError(null),
  };
}
