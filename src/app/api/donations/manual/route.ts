import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase";

const manualDonationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Donor name must be at least 2 characters")
    .max(100, "Donor name must be 100 characters or fewer"),
  email: z.string().trim().email("Enter a valid donor email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(30, "Phone number must be 30 characters or fewer"),
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(100000000, "Amount is too large"),
  referralCode: z.string().trim().max(50).optional(),
  message: z.string().trim().max(500).optional(),
});

function getManagerId(request: NextRequest) {
  const managerCookie = request.cookies.get("manager_session");

  if (!managerCookie) {
    return null;
  }

  try {
    const session = JSON.parse(managerCookie.value);
    return typeof session?.id === "string" ? session.id : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const managerId = getManagerId(request);
    if (!managerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = supabaseServer();
    const { data: manager, error: managerError } = await supabase
      .from("managers")
      .select("id")
      .eq("id", managerId)
      .eq("is_active", true)
      .maybeSingle();

    if (managerError) {
      console.error("Manager verification error:", managerError);
      return NextResponse.json(
        { error: "Failed to verify manager session" },
        { status: 500 }
      );
    }

    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validationResult = manualDonationSchema.safeParse(
      await request.json()
    );

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            validationResult.error.errors[0]?.message ||
            "Invalid donation details",
        },
        { status: 400 }
      );
    }

    const { fullName, phone, amount, message } = validationResult.data;
    const email = validationResult.data.email.toLowerCase();
    const referralCode = validationResult.data.referralCode
      ? validationResult.data.referralCode.toUpperCase()
      : null;

    let internId: string | null = null;
    if (referralCode) {
      const { data: intern, error: internError } = await supabase
        .from("interns")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();

      if (internError) {
        console.error("Manual donation intern lookup error:", internError);
        return NextResponse.json(
          { error: "Failed to validate referral code" },
          { status: 500 }
        );
      }

      if (!intern) {
        return NextResponse.json(
          { error: "Referral code does not belong to a registered intern" },
          { status: 400 }
        );
      }

      internId = intern.id;
    }

    const { data: existingDonor, error: donorLookupError } = await supabase
      .from("donors")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (donorLookupError) {
      console.error("Manual donation donor lookup error:", donorLookupError);
      return NextResponse.json(
        { error: "Failed to look up donor" },
        { status: 500 }
      );
    }

    let donorId = existingDonor?.id;
    if (!donorId) {
      const { data: newDonor, error: donorCreateError } = await supabase
        .from("donors")
        .insert({
          full_name: fullName,
          email,
          phone,
        })
        .select("id")
        .single();

      if (donorCreateError) {
        console.error("Manual donation donor creation error:", donorCreateError);
        return NextResponse.json(
          { error: "Failed to create donor" },
          { status: 500 }
        );
      }

      donorId = newDonor.id;
    }

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        donor_id: donorId,
        intern_id: internId,
        amount,
        currency: "INR",
        message: message || null,
        referral_code: referralCode,
        status: "completed",
        receipt_sent: false,
      })
      .select("id")
      .single();

    if (donationError) {
      console.error("Manual donation creation error:", donationError);
      return NextResponse.json(
        { error: "Failed to add manual donation" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Manual donation added successfully",
        donationId: donation.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Manual donation creation error:", error);
    return NextResponse.json(
      { error: "Failed to add manual donation" },
      { status: 500 }
    );
  }
}
