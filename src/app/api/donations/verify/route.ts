import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, generateDonationReceiptHTML } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, payment_id, signature, donation_id } = body;

    if (!order_id || !payment_id || !signature || !donation_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Update payment record
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
      console.error("Payment update error:", paymentError);
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      );
    }

    // Update donation status
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
      console.error("Donation update error:", donationError);
      return NextResponse.json(
        { error: "Failed to update donation" },
        { status: 500 }
      );
    }

    // Get donor details for receipt
    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .select("full_name, email")
      .eq("id", donation.donor_id)
      .single();

    if (donorError) {
      console.error("Donor fetch error:", donorError);
    }

    // Send receipt email
    try {
      if (donor) {
        const receiptHTML = generateDonationReceiptHTML(
          donor.full_name,
          donation.amount,
          donation.created_at,
          payment_id
        );

        await sendEmail({
          to: donor.email,
          subject: `Donation Receipt - Save Rana National Trust`,
          html: receiptHTML,
        });

        // Mark receipt as sent
        await supabase
          .from("donations")
          .update({ receipt_sent: true })
          .eq("id", donation.id);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the payment if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      donation_id: donation.id,
      payment_id: payment.id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
