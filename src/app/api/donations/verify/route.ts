import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { checkPhonePeTransactionStatus } from "@/lib/phonepe";
import { sendEmail, generateDonationReceiptHTML } from "@/lib/email";

// PhonePe redirects the user here using POST method
export async function POST(request: NextRequest) {
  try {
    let transactionId = "";
    
    // PhonePe sends form data on redirect POST
    try {
      const formData = await request.formData();
      transactionId = formData.get("transactionId") as string || formData.get("merchantTransactionId") as string;
    } catch {
      // Fallback if they send JSON or we can't parse formData
      const body = await request.json().catch(() => ({}));
      transactionId = body.transactionId || body.merchantTransactionId;
    }

    if (!transactionId) {
      const url = new URL(request.url);
      transactionId = url.searchParams.get("transactionId") as string;
    }

    const errorRedirectUrl = new URL("/donate/error", request.url);

    if (!transactionId) {
      console.error("Missing transactionId in return url");
      return NextResponse.redirect(errorRedirectUrl, 303);
    }

    // Call PhonePe API to check the actual status securely
    const statusResponse = await checkPhonePeTransactionStatus(transactionId);
    
    const supabase = supabaseServer();

    // Fetch donation by PG order ID (which is the transactionId)
    const { data: existingDonation, error: fetchError } = await supabase
      .from("donations")
      .select("id, status, pg_order_id, receipt_sent, donor_id, amount, created_at")
      .eq("pg_order_id", transactionId)
      .single();

    if (fetchError || !existingDonation) {
      console.error("Donation not found for transaction:", transactionId);
      return NextResponse.redirect(errorRedirectUrl, 303);
    }

    // If already completed, just redirect to success
    if (existingDonation.status === "completed") {
       return NextResponse.redirect(new URL(`/donate/success?donation_id=${existingDonation.id}`, request.url), 303);
    }

    if (statusResponse.success && statusResponse.code === "PAYMENT_SUCCESS") {
      // Payment successful
      const paymentId = statusResponse.data?.providerReferenceId || "unknown";
      
      const receiptNumber = `RECEIPT-${existingDonation.id.substring(0, 8)}-${Date.now()}`;

      // Update donation status
      const { data: donation, error: donationError } = await supabase
        .from("donations")
        .update({
          status: "completed",
          pg_payment_id: paymentId,
          receipt_number: receiptNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDonation.id)
        .select()
        .single();

      if (donationError || !donation) {
        console.error("Donation update error", donationError);
        return NextResponse.redirect(errorRedirectUrl, 303);
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
            paymentId
          );

          await sendEmail({
            to: donor.email,
            subject: `Donation Receipt - Get Wish Foundation`,
            html: receiptHTML,
          });

          await supabase
            .from("donations")
            .update({ receipt_sent: true })
            .eq("id", donation.id);
        } catch (e) {
          console.error("Email sending failed - Will retry later", e);
        }
      }

      // Redirect user to success page
      return NextResponse.redirect(new URL(`/donate/success?donation_id=${donation.id}`, request.url), 303);
    } else if (statusResponse.code === "PAYMENT_PENDING") {
      // Do nothing, leave it as pending in the database.
      // PhonePe webhooks will eventually update this to success or failure.
      // For now, redirect to error/pending page (we will use error page for now)
      return NextResponse.redirect(errorRedirectUrl, 303);
    } else {
      // Payment failed
      await supabase
        .from("donations")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDonation.id)
        .neq("status", "completed");

      return NextResponse.redirect(errorRedirectUrl, 303);
    }
  } catch (err) {
    console.error("PhonePe verification error", err);
    return NextResponse.redirect(new URL("/donate/error", request.url), 303);
  }
}
