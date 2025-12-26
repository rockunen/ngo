import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { internLoginSchema } from "@/lib/types";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = internLoginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    const supabase = supabaseServer();

    // Find intern by email
    const { data: intern, error: findError } = await supabase
      .from("interns")
      .select("*")
      .eq("email", email)
      .single();

    if (findError || !intern) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordHash = crypto
      .createHash("sha256")
      .update(password + (process.env.INTERN_PASSWORD_SALT || "default_salt"))
      .digest("hex");

    if (passwordHash !== intern.password_hash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
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
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      intern_id: intern.id,
      intern_name: intern.name,
      session_token: sessionToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
