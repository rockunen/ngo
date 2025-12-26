import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { z } from "zod";
import crypto from "crypto";

// Generate unique referral code
function generateReferralCode(): string {
  // Format: INTERN-XXXXX (uppercase alphanumeric, 10 characters total)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "INTERN-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// API validation schema (doesn't require confirmPassword since frontend already validated it)
const internSignupAPISchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^[0-9\s\-\+\(\)]*$/,
      "Phone number can only contain digits, spaces, dashes, and parentheses"
    )
    .refine((phone) => {
      const digitsOnly = phone.replace(/\D/g, "");
      return digitsOnly.length >= 10;
    }, "Phone number must contain at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = internSignupAPISchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validationResult.data;

    const supabase = supabaseServer();

    // Check if email already exists
    const { data: existingIntern } = await supabase
      .from("interns")
      .select("id")
      .eq("email", email)
      .single();

    if (existingIntern) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = crypto
      .createHash("sha256")
      .update(password + (process.env.INTERN_PASSWORD_SALT || "default_salt"))
      .digest("hex");

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = true;
    let attempts = 0;

    // Ensure referral code is unique (retry up to 5 times)
    while (codeExists && attempts < 5) {
      const { data: existingCode } = await supabase
        .from("interns")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

      if (!existingCode) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    if (codeExists) {
      return NextResponse.json(
        { error: "Failed to generate unique referral code" },
        { status: 500 }
      );
    }

    // Create intern
    const { data: intern, error: internError } = await supabase
      .from("interns")
      .insert([
        {
          name,
          email,
          phone,
          password_hash: passwordHash,
          referral_code: referralCode,
        },
      ])
      .select()
      .single();

    if (internError) {
      console.error("Intern signup error:", internError);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { error: sessionError } = await supabase
      .from("intern_sessions")
      .insert([
        {
          intern_id: intern.id,
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
        },
      ]);

    if (sessionError) {
      console.error("Session creation error:", sessionError);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      intern_id: intern.id,
      referral_code: referralCode,
      session_token: sessionToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
