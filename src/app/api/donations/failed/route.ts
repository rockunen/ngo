import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

// CORS headers for production
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(
    (allowed) =>
      origin === allowed ||
      origin.includes("vercel.app") ||
      origin === process.env.NEXT_PUBLIC_APP_URL
  );
}

export async function POST(request: NextRequest) {
  try {
    // CORS Check
    const origin = request.headers.get("origin");
    if (!isOriginAllowed(origin)) {
      console.warn(`Unauthorized origin attempted: ${origin}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = request.json();
    const { donation_id, order_id, failure_reason } = await body;

    if (!donation_id || !order_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Update donation status to failed
    const { error: donationError } = await supabase
      .from("donations")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation_id);

    if (donationError) {
      console.error("Failed to update donation status:", donationError);
      return NextResponse.json(
        { error: "Failed to record payment failure" },
        { status: 500 }
      );
    }

    // Update payment record with failure reason
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "failed",
        failure_reason: failure_reason || "Payment declined",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", order_id);

    if (paymentError) {
      console.error("Failed to update payment record:", paymentError);
      // Don't fail the response - donation is already marked as failed
    }

    console.info(
      `Payment failed for donation ${donation_id}: ${
        failure_reason || "Unknown reason"
      }`
    );

    return NextResponse.json({
      success: true,
      message: "Payment failure recorded",
      donation_id,
    });
  } catch (error) {
    console.error("Payment failure recording error:", error);
    return NextResponse.json(
      { error: "Failed to process payment failure" },
      { status: 500 }
    );
  }
}
