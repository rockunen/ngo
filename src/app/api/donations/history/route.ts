import { NextRequest, NextResponse } from "next/server";
import { donationService } from "@/lib/donation";
import { authService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get donation history for user
    const donations = await donationService.getDonationHistory(user.id, 50);

    return NextResponse.json({
      success: true,
      data: donations,
    });
  } catch (error: any) {
    console.error("Donation history fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch donation history" },
      { status: 500 }
    );
  }
}
