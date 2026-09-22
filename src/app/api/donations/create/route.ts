import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createPhonePeOrder, validateDonationAmount } from "@/lib/phonepe";
import { donationFormSchema } from "@/lib/types";

import { isRequestAllowed } from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    // CORS Check
    if (!isRequestAllowed(request)) {
      console.warn(`Unauthorized origin attempted: ${request.headers.get("origin")}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = donationFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = validationResult.data;
    const internId = body.internId || null; // Optional: if donation is from an intern
    const referralCode = data.referralCode || null; // Referral code (from intern or manual entry)

    // Validate amount range
    const amountInPaise = Math.round(data.amount * 100);
    if (!validateDonationAmount(amountInPaise)) {
      return NextResponse.json(
        { error: "Invalid donation amount. Must be between ₹500 and ₹100,000" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // If referral code is provided, look up the intern ID
    let resolvedInternId = internId;
    if (referralCode && !internId) {
      const { data: internData, error: internError } = await supabase
        .from("interns")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

      if (!internError && internData) {
        resolvedInternId = internData.id;
      }
    }

    // Create or get donor
    const { data: existingDonor, error: getDonorError } = await supabase
      .from("donors")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    let donorId: string;

    if (getDonorError) {
      console.error("Get donor error:", getDonorError);
      return NextResponse.json(
        { error: "Failed to process donation" },
        { status: 500 }
      );
    }

    if (!existingDonor) {
      // Donor doesn't exist, create new
      const { data: newDonor, error: createError } = await supabase
        .from("donors")
        .insert([
          {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            pan_number: data.panNumber,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          },
        ])
        .select("id")
        .single();

      if (createError) {
        console.error("Create donor error:", createError);
        return NextResponse.json(
          { error: "Failed to process donation" },
          { status: 500 }
        );
      }

      donorId = newDonor.id;
    } else {
      donorId = existingDonor.id;
    }

    // Generate a stable idempotency key: same donor + amount + 1-minute window
    // This prevents duplicate orders when a user double-clicks within 60 seconds.
    let idempotencyKey = `rzp-donation-${donorId}-${amountInPaise}-${Math.floor(
      Date.now() / 60000
    )}`;

    // --- Idempotency check ---
    const { data: existingDonation } = await supabase
      .from("donations")
      .select("id, pg_order_id, status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (existingDonation) {
      // If previous donation exists, make key unique so user can donate again and get a new PhonePe transaction ID
      idempotencyKey = `${idempotencyKey}-${Date.now()}`;
    }
    // -------------------------------------------------------------------------

    // Create PhonePe order transaction ID before insert
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const donationPayload: any = {
      donor_id: donorId,
      amount: data.amount,
      currency: "INR",
      message: data.message || null,
      referral_code: referralCode,
      status: "pending",
      receipt_sent: false,
      idempotency_key: idempotencyKey, // always stored, used for dedup
      pg_order_id: transactionId,
    };

    // Add intern_id if this donation was referred by an intern
    if (resolvedInternId) {
      donationPayload.intern_id = resolvedInternId;
    }

    // Create donation record
    let donation: any = null;
    let donationError: any = null;

    const { data: insertedData, error: insertError } = await supabase
      .from("donations")
      .insert([donationPayload])
      .select()
      .single();
    
    if (insertError) {
      if (insertError.code === '23505') {
        // Unique constraint violation (race condition / double click)
        return NextResponse.json(
          { error: "A donation is already being processed. Please wait a moment." },
          { status: 429 }
        );
      }
      donationError = insertError;
    } else {
      donation = insertedData;
    }

    if (donationError || !donation) {
      console.error("Create donation error:", {
        code: donationError?.code,
        message: donationError?.message,
        details: donationError?.details,
      });
      return NextResponse.json(
        { error: "Failed to process donation" },
        { status: 500 }
      );
    }

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    
    // Return URL for the user to be redirected to
    const returnUrl = `${hostUrl}/api/donations/verify`;
    // Callback URL for PhonePe server-to-server webhook
    const callbackUrl = `${hostUrl}/api/webhooks/phonepe`;

    const phonepeOrder = await createPhonePeOrder({
      amount: amountInPaise,
      transactionId,
      userId: donorId,
      mobileNumber: data.phone,
      returnUrl,
      callbackUrl,
    });

    return NextResponse.json({
      success: true,
      redirectUrl: phonepeOrder.redirectUrl,
      transactionId,
      donation_id: donation.id,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    return NextResponse.json(
      { error: "Failed to process donation request" },
      { status: 500 }
    );
  }
}
