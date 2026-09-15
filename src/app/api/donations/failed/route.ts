import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

import { isRequestAllowed } from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    // CORS Check
    if (!isRequestAllowed(request)) {
      console.warn(`Unauthorized origin attempted: ${request.headers.get("origin")}`);
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
