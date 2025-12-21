import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, payload } = body;

    console.log(`Webhook received: ${event}`);

    // Only process payment authorized events
    if (event === "payment.authorized") {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        payload.payment;

      // Verify signature for security
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        console.error(`Invalid signature for payment: ${razorpay_payment_id}`);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }

      const supabase = supabaseServer();

      // Find donation by order ID
      const { data: donation, error: fetchError } = await supabase
        .from("donations")
        .select("id, status")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (fetchError || !donation) {
        console.error(`Donation not found for order: ${razorpay_order_id}`);
        return NextResponse.json(
          { error: "Donation not found" },
          { status: 404 }
        );
      }

      // Update payment record
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          razorpay_payment_id,
          razorpay_signature,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (paymentError) {
        console.error("Failed to update payment:", paymentError);
      }

      // Update donation status
      const { error: donationError } = await supabase
        .from("donations")
        .update({
          status: "completed",
          razorpay_payment_id,
          razorpay_signature,
          updated_at: new Date().toISOString(),
        })
        .eq("id", donation.id);

      if (donationError) {
        console.error("Failed to update donation:", donationError);
      }

      console.info(
        `Payment webhook processed: ${razorpay_payment_id} for donation: ${donation.id}`
      );

      return NextResponse.json({
        success: true,
        message: "Webhook processed",
      });
    }

    // Handle payment failed event
    if (event === "payment.failed") {
      const { razorpay_payment_id, razorpay_order_id, error } = payload.payment;

      const supabase = supabaseServer();

      // Find donation by order ID
      const { data: donation } = await supabase
        .from("donations")
        .select("id")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (donation) {
        // Update donation status to failed
        await supabase
          .from("donations")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", donation.id);

        // Update payment record with failure reason
        await supabase
          .from("payments")
          .update({
            status: "failed",
            failure_reason: error?.description || "Payment failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpay_order_id);

        console.info(
          `Payment failed webhook: ${razorpay_payment_id} - ${error?.description}`
        );
      }

      return NextResponse.json({
        success: true,
        message: "Webhook processed",
      });
    }

    // Acknowledge other events (required by Razorpay)
    return NextResponse.json({
      success: true,
      message: "Webhook acknowledged",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
