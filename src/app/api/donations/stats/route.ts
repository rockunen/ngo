import { NextRequest, NextResponse } from "next/server";
import { donationService } from "@/lib/donation";
import { authService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get current user (optional - if user is authenticated, get their stats)
    let user;
    try {
      user = await authService.getCurrentUser();
    } catch (e) {
      // User not authenticated, will get global stats
      user = null;
    }

    // Get donation statistics
    const stats = await donationService.getDonationStats(user?.id);

    return NextResponse.json({
      success: true,
      data: stats,
      isPersonal: !!user,
    });
  } catch (error: any) {
    console.error("Donation statistics fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch donation statistics" },
      { status: 500 }
    );
  }
}
