import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createRazorpayOrder } from "@/lib/razorpay";
import { donationFormSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = donationFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const supabase = supabaseServer();

    // Create or get donor
    let donor = await supabase
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
        console.error("Create donor error:", createError);
        return NextResponse.json(
          { error: "Failed to create donor" },
          { status: 500 }
        );
      }

      donorId = newDonor.id;
    } else if (donor.error) {
      console.error("Get donor error:", donor.error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    } else {
      donorId = donor.data.id;
    }

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert([
        {
          donor_id: donorId,
          amount: data.amount,
          currency: "INR",
          message: data.message,
          status: "pending",
          receipt_sent: false,
        },
      ])
      .select()
      .single();

    if (donationError) {
      console.error("Create donation error:", donationError);
      return NextResponse.json(
        { error: "Failed to create donation" },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const amountInPaise = Math.round(data.amount * 100);
    const receipt = `DONATION-${donorId}-${Date.now()}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        donor_id: donorId,
        donation_id: donation.id,
        donor_name: data.fullName,
        donor_email: data.email,
      },
    });

    // Create payment record linked to donation
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          donation_id: donation.id,
          razorpay_order_id: razorpayOrder.id,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (paymentError) {
      console.error("Create payment error:", paymentError);
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: data.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      donor_name: data.fullName,
      donor_email: data.email,
      donation_id: donation.id,
      payment_id: payment.id,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
