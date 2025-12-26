import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("intern_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = supabaseServer();

    // Delete session token from database
    const { error: deleteError } = await supabase
      .from("intern_sessions")
      .delete()
      .eq("token", token);

    if (deleteError) {
      console.error("Session deletion error:", deleteError);
      // Still return success as we'll clear the cookie
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the intern_session cookie
    response.cookies.delete("intern_session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Still try to clear the cookie even if logout fails
    const response = NextResponse.json(
      { error: "Failed to logout" },
      { status: 400 }
    );
    response.cookies.delete("intern_session");

    return response;
  }
}
