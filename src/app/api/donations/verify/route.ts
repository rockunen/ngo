import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, generateDonationReceiptHTML } from "@/lib/email";

// CORS headers for production
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
];

export async function POST(request: NextRequest) {
  try {
    // CORS Check
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      console.warn(`Unauthorized origin attempted: ${origin}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { order_id, payment_id, signature, donation_id } = body;

    // Validate required fields
    if (!order_id || !payment_id || !signature || !donation_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify Razorpay signature from checkout
    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);
    if (!isValid) {
      console.warn(`Invalid signature for order: ${order_id}`);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Fetch donation and ensure it matches this order
    const { data: existingDonation, error: fetchError } = await supabase
      .from("donations")
      .select(
        "id, status, razorpay_order_id, receipt_sent, donor_id, amount, created_at"
      )
      .eq("id", donation_id)
      .single();

    if (fetchError || !existingDonation) {
      console.error("Donation not found:", donation_id);
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // Ensure the order_id matches the donation's stored order
    if (
      !existingDonation.razorpay_order_id ||
      existingDonation.razorpay_order_id !== order_id
    ) {
      console.error("Mismatched order ID for donation", {
        donation_id,
        expected: existingDonation.razorpay_order_id,
        got: order_id,
      });
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    }

    // If already completed, return success idempotently
    if (existingDonation.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        donation_id: existingDonation.id,
        payment_id,
      });
    }

    // Generate receipt number
    const receiptNumber = `RECEIPT-${donation_id.substring(
      0,
      8
    )}-${Date.now()}`;

    // Update donation status with payment info
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .update({
        status: "completed",
        razorpay_order_id: order_id,
        razorpay_payment_id: payment_id,
        razorpay_signature: signature,
        receipt_number: receiptNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation_id)
      .select()
      .single();

    if (donationError || !donation) {
      console.error(
        "Donation update error - Database operation failed",
        donationError
      );
      return NextResponse.json(
        { error: "Failed to complete donation" },
        { status: 500 }
      );
    }

    // Get donor details for receipt
    const { data: donor } = await supabase
      .from("donors")
      .select("full_name, email")
      .eq("id", donation.donor_id)
      .single();

    // Send receipt email if not already sent
    if (donor && !existingDonation.receipt_sent) {
      try {
        const receiptHTML = generateDonationReceiptHTML(
          donor.full_name,
          donation.amount,
          donation.created_at,
          payment_id
        );

        await sendEmail({
          to: donor.email,
          subject: `Donation Receipt - Get Wish Foundation`,
          html: receiptHTML,
        });

        // Mark receipt as sent
        await supabase
          .from("donations")
          .update({ receipt_sent: true })
          .eq("id", donation.id);
      } catch {
        console.error("Email sending failed - Will retry later");
        // Non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      donation_id: donation.id,
      payment_id,
    });
  } catch {
    console.error("Payment verification error - System error occurred");
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
