import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createRazorpayOrder, validateDonationAmount } from "@/lib/razorpay";
import { donationFormSchema } from "@/lib/types";

// CORS headers for production
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Allow requests without origin (server-to-server)
  return ALLOWED_ORIGINS.some(
    (allowed) =>
      origin === allowed ||
      origin.includes("vercel.app") ||
      origin === process.env.NEXT_PUBLIC_APP_URL
  );
}

export async function POST(request: NextRequest) {
  try {
    // CORS Check
    const origin = request.headers.get("origin");
    if (!isOriginAllowed(origin)) {
      console.warn(`Unauthorized origin attempted: ${origin}`);
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

    // Create or get donor
    const donor = await supabase
      .from("donors")
      .select("id")
      .eq("email", data.email)
      .single();

    let donorId: string;

    if (donor.error?.code === "PGRST116") {
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
        console.error("Create donor error - Database operation failed");
        return NextResponse.json(
          { error: "Failed to process donation" },
          { status: 500 }
        );
      }

      donorId = newDonor.id;
    } else if (donor.error) {
      console.error("Get donor error - Database operation failed");
      return NextResponse.json(
        { error: "Failed to process donation" },
        { status: 500 }
      );
    } else {
      donorId = donor.data.id;
    }

    // Create idempotency key
    const idempotencyKey = `${donorId}-${
      data.email
    }-${amountInPaise}-${Math.floor(Date.now() / 60000)}`;

    const donationPayload: any = {
      donor_id: donorId,
      amount: data.amount,
      currency: "INR",
      message: data.message || null,
      referral_code: referralCode,
      status: "pending",
      receipt_sent: false,
    };

    // Add intern_id if this is an intern donation
    if (internId) {
      donationPayload.intern_id = internId;
    }

    // Add idempotency key if needed
    if (process.env.NODE_ENV === "production") {
      donationPayload.idempotency_key = idempotencyKey;
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

    // Create Razorpay order
    const receipt = `DONATION-${donorId}-${Date.now()}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        donor_id: donorId,
        donation_id: donation.id,
        donor_name: data.fullName,
        intern_id: internId || "",
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
      intern_id: internId,
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
