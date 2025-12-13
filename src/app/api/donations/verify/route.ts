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

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);
    if (!isValid) {
      console.warn(`Invalid signature for order: ${order_id}`);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Verify donation exists before updating
    const { data: existingDonation, error: fetchError } = await supabase
      .from("donations")
      .select("id, status")
      .eq("id", donation_id)
      .single();

    if (fetchError || !existingDonation) {
      console.error("Donation not found:", donation_id);
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // Prevent double-processing
    if (existingDonation.status === "completed") {
      console.warn(`Duplicate payment attempt for donation: ${donation_id}`);
      return NextResponse.json(
        { success: true, message: "Payment already processed" },
        { status: 200 }
      );
    }

    // Update donation status first (most critical)
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .update({
        status: "completed",
        razorpay_order_id: order_id,
        razorpay_payment_id: payment_id,
        razorpay_signature: signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation_id)
      .select()
      .single();

    if (donationError) {
      console.error("Donation update error - Database operation failed");
      // IMPORTANT: Don't update payment record if donation update fails
      return NextResponse.json(
        { error: "Failed to complete donation" },
        { status: 500 }
      );
    }

    // Update payment record only after donation is successfully updated
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        razorpay_payment_id: payment_id,
        razorpay_signature: signature,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", order_id)
      .select()
      .single();

    if (paymentError) {
      console.error("Payment update error - Database operation failed");
      // Log warning: donation is completed but payment record failed
      console.warn(
        `Payment record update failed for donation: ${donation_id}. Donation marked completed but payment not fully recorded.`
      );
      // Still return success because donation is the source of truth
    }

    // Get donor details for receipt
    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .select("full_name, email")
      .eq("id", donation.donor_id)
      .single();

    if (donorError) {
      console.error("Donor fetch error - Database operation failed");
    }

    // Send receipt email asynchronously (don't block payment verification)
    if (donor) {
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
      } catch (emailError) {
        console.error("Email sending failed - Will retry later");
        // Don't fail the payment if email fails
      }
    }

    // Log successful verification
    console.info(
      `Payment verified successfully: ${payment_id} for donation: ${donation_id}`
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      donation_id: donation.id,
      payment_id: payment.id,
    });
  } catch (error) {
    console.error("Payment verification error - System error occurred");
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
