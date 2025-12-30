import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Verify manager is authenticated by checking the manager session cookie
    const managerSession = request.cookies.get("manager_session");
    if (!managerSession) {
      return NextResponse.json(
        { error: "Unauthorized: Manager not authenticated" },
        { status: 401 }
      );
    }

    const supabase = supabaseServer();

    // Fetch all interns, ordered by creation date (newest first)
    const { data: interns, error } = await supabase
      .from("interns")
      .select("id, name, email, phone, referral_code, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching interns:", error);
      return NextResponse.json(
        { error: "Failed to fetch interns" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        interns: interns || [],
        total: interns?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
