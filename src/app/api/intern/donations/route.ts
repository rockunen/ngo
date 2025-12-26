import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("intern_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = supabaseServer();

    // Verify session token and get intern_id
    const { data: session } = await supabase
      .from("intern_sessions")
      .select("intern_id, expires_at")
      .eq("token", token)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get intern's referral code
    const { data: intern, error: internError } = await supabase
      .from("interns")
      .select("referral_code")
      .eq("id", session.intern_id)
      .single();

    if (internError || !intern) {
      console.error("Intern fetch error:", internError);
      return NextResponse.json(
        { error: "Failed to fetch intern details" },
        { status: 500 }
      );
    }

    // Get all donations made using this intern's referral code with donor details
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("*, donors(full_name, email, phone, city, state)")
      .eq("referral_code", intern.referral_code)
      .order("created_at", { ascending: false });

    if (donationsError) {
      console.error("Donations fetch error:", donationsError);
      return NextResponse.json(
        { error: "Failed to fetch donations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referral_code: intern.referral_code,
      donations: donations || [],
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
