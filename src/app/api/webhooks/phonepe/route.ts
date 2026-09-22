import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { verifyPhonePeSignature } from "@/lib/phonepe";
import { sendEmail, generateDonationReceiptHTML } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-verify");
    const body = await request.json();
    
    if (!body.response) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const valid = verifyPhonePeSignature(body.response, signature);
    if (!valid) {
      console.error("Invalid PhonePe webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const decodedResponse = Buffer.from(body.response, "base64").toString("utf8");
    const payload = JSON.parse(decodedResponse);

    if (payload.success && payload.code === "PAYMENT_SUCCESS") {
      const transactionId = payload.data.merchantTransactionId;
      const paymentId = payload.data.transactionId || payload.data.providerReferenceId;

      const supabase = supabaseServer();

      // Find donation by PG order ID
      const { data: donation } = await supabase
        .from("donations")
        .select("id, status, donor_id, amount, created_at, receipt_sent")
        .eq("pg_order_id", transactionId)
        .single();

      if (!donation) {
        console.error(`Donation not found for transaction: ${transactionId}`);
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
      }

      // Idempotent update: only update if not already completed
      const { data: updatedDonation, error: updateErr } = await supabase
        .from("donations")
        .update({
          status: "completed",
          pg_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", donation.id)
        .neq("status", "completed")
        .select("id, donor_id, amount, created_at, receipt_sent")
        .maybeSingle();

      if (updateErr) {
        console.error("Failed to update donation on webhook:", updateErr);
      }

      if (updatedDonation && !updatedDonation.receipt_sent) {
        try {
          const { data: donor } = await supabase
            .from("donors")
            .select("full_name, email")
            .eq("id", updatedDonation.donor_id)
            .single();

          if (donor) {
            const receiptHTML = generateDonationReceiptHTML(
              donor.full_name,
              updatedDonation.amount,
              updatedDonation.created_at,
              paymentId
            );

            await sendEmail({
              to: donor.email,
              subject: "Donation Receipt - Get Wish Foundation",
              html: receiptHTML,
            });

            await supabase
              .from("donations")
              .update({ receipt_sent: true })
              .eq("id", updatedDonation.id);
          }
        } catch (emailErr) {
          console.error("Webhook: receipt email failed", emailErr);
        }
      }
    } else if (payload.code !== "PAYMENT_PENDING") {
      // Payment failed (ignore PAYMENT_PENDING as it's already pending)
      const transactionId = payload.data?.merchantTransactionId;
      if (transactionId) {
        const supabase = supabaseServer();
        await supabase
          .from("donations")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("pg_order_id", transactionId)
          .neq("status", "completed");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
