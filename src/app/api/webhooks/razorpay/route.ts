import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature using raw body and header
    const signature = request.headers.get("x-razorpay-signature");
    const rawBody = await request.text();

    const valid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!valid) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const { event, payload } = body;

    console.log(`Webhook received: ${event}`);

    const supabase = supabaseServer();

    if (event === "payment.captured") {
      const payment = payload?.payment?.entity;
      const payment_id: string | undefined = payment?.id;
      const order_id: string | undefined = payment?.order_id;

      if (!payment_id || !order_id) {
        console.error("Webhook missing payment/order ids");
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      // Find donation by Razorpay order ID
      const { data: donation } = await supabase
        .from("donations")
        .select("id, status")
        .eq("razorpay_order_id", order_id)
        .single();

      if (!donation) {
        console.error(`Donation not found for order: ${order_id}`);
        return NextResponse.json(
          { error: "Donation not found" },
          { status: 404 }
        );
      }

      // Idempotent update: only update if not already completed
      const { error: updateErr } = await supabase
        .from("donations")
        .update({
          status: "completed",
          razorpay_payment_id: payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", donation.id)
        .neq("status", "completed");

      if (updateErr) {
        console.error("Failed to update donation on webhook:", updateErr);
      }

      return NextResponse.json({ success: true });
    }

    if (event === "payment.failed") {
      const payment = payload?.payment?.entity;
      const order_id: string | undefined = payment?.order_id;

      if (!order_id) {
        console.error("Webhook missing order id for failure event");
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      // Find donation by order ID
      const { data: donation } = await supabase
        .from("donations")
        .select("id")
        .eq("razorpay_order_id", order_id)
        .single();

      if (donation) {
        await supabase
          .from("donations")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", donation.id)
          .neq("status", "completed");
      }

      return NextResponse.json({ success: true });
    }

    // Acknowledge other events but do not mutate state (e.g., payment.authorized)
    return NextResponse.json({ success: true, message: "Event acknowledged" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
