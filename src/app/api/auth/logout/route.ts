import { NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function POST() {
  try {
    // Sign out from Supabase Auth
    await authService.signOut();

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Signed out successfully",
      },
      { status: 200 }
    );

    // Clear the manager_session cookie
    response.cookies.delete("manager_session");

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);

    // Still try to clear the cookie even if logout fails
    const response = NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: 400 }
    );
    response.cookies.delete("manager_session");

    return response;
  }
}
