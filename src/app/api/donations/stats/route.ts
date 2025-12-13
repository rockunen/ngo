import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

// CORS headers for production
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(
    (allowed) =>
      origin === allowed ||
      origin.includes("vercel.app") ||
      origin === process.env.NEXT_PUBLIC_APP_URL
  );
}

export async function GET(request: NextRequest) {
  try {
    // CORS Check
    const origin = request.headers.get("origin");
    if (!isOriginAllowed(origin)) {
      console.warn(`Unauthorized origin attempted: ${origin}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = supabaseServer();

    // Get statistics ONLY for completed donations
    const { data: completedDonations, error } = await supabase
      .from("donations")
      .select("amount")
      .eq("status", "completed");

    if (error) {
      console.error("Donations query error:", error);
      throw error;
    }

    // Calculate statistics
    const donations = completedDonations || [];
    const totalAmount =
      donations.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    const totalCount = donations.length;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

    // Get pending donations count (for reference only)
    const { count: pendingCount } = await supabase
      .from("donations")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    // Get failed donations count (for reference only)
    const { count: failedCount } = await supabase
      .from("donations")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed");

    return NextResponse.json({
      success: true,
      data: {
        completed: {
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          averageAmount: parseFloat(averageAmount.toFixed(2)),
          count: totalCount,
        },
        pending: {
          count: pendingCount || 0,
        },
        failed: {
          count: failedCount || 0,
        },
        summary: {
          allDonations: totalCount + (pendingCount || 0) + (failedCount || 0),
          completedDonations: totalCount,
          pendingDonations: pendingCount || 0,
          failedDonations: failedCount || 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Donation statistics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation statistics" },
      { status: 500 }
    );
  }
}
