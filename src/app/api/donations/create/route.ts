import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createRazorpayOrder, validateDonationAmount } from "@/lib/razorpay";
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
        { error: "Invalid donation amount. Must be between ₹1 and ₹100,000" },
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
      console.error("Get donor error:", {
        code: getDonorError.code,
        message: getDonorError.message,
        details: getDonorError.details,
        hint: getDonorError.hint,
      });
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
        console.error("Create donor error:", {
          code: createError.code,
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
        });
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
    // This prevents duplicate orders when a user double-clicks or retries within 60 seconds.
    const idempotencyKey = `rzp-donation-${donorId}-${amountInPaise}-${Math.floor(
      Date.now() / 60000
    )}`;

    // --- Idempotency check: return existing pending order if key already used ---
    const { data: existingDonation } = await supabase
      .from("donations")
      .select("id, razorpay_order_id")
      .eq("idempotency_key", idempotencyKey)
      .eq("status", "pending")
      .maybeSingle();

    if (existingDonation?.razorpay_order_id) {
      // Reuse the existing Razorpay order — no double charge risk
      return NextResponse.json({
        success: true,
        order_id: existingDonation.razorpay_order_id,
        amount: data.amount,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        donor_name: data.fullName,
        donation_id: existingDonation.id,
        intern_id: resolvedInternId,
        referral_code: referralCode,
      });
    }
    // -------------------------------------------------------------------------

    const donationPayload: any = {
      donor_id: donorId,
      amount: data.amount,
      currency: "INR",
      message: data.message || null,
      referral_code: referralCode,
      status: "pending",
      receipt_sent: false,
      idempotency_key: idempotencyKey, // always stored, used for dedup
    };

    // Add intern_id if this donation was referred by an intern
    if (resolvedInternId) {
      donationPayload.intern_id = resolvedInternId;
    }

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert([donationPayload])
      .select()
      .single();

    if (donationError) {
      console.error("Create donation error:", {
        code: donationError.code,
        message: donationError.message,
        details: donationError.details,
        hint: donationError.hint,
      });
      return NextResponse.json(
        { error: "Failed to process donation" },
        { status: 500 }
      );
    }

    // Create Razorpay order — pass idempotency key so Razorpay deduplicates on their side
    const receipt = `DONATION-${donorId}-${Date.now()}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      idempotencyKey,
      notes: {
        donor_id: donorId,
        donation_id: donation.id,
        donor_name: data.fullName,
        intern_id: resolvedInternId || "",
        referral_code: referralCode || "",
      },
    });

    // Update donation with Razorpay order ID (will be fully updated after payment)
    await supabase
      .from("donations")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", donation.id);

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: data.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      donor_name: data.fullName,
      donation_id: donation.id,
      intern_id: resolvedInternId,
      referral_code: referralCode,
    });
  } catch {
    console.error("Donation creation error - System error occurred");
    return NextResponse.json(
      { error: "Failed to process donation request" },
      { status: 500 }
    );
  }
}
