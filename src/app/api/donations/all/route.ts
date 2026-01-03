import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Check if user has manager cookie
    const managerCookie = request.cookies.get("manager_session");
    if (!managerCookie) {
      return NextResponse.json(
        { error: "Unauthorized - Manager session required" },
        { status: 401 }
      );
    }

    const supabase = supabaseServer();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch all donations with pagination and relational data
    const { data, count, error } = await supabase
      .from("donations")
      .select(
        `
        id,
        amount,
        currency,
        message,
        status,
        created_at,
        donor_id,
        intern_id,
        donors:donor_id(id, full_name, email),
        interns:intern_id(id, name)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Donations query error:", error);
      throw error;
    }

    // Format the response - handle the relational data from Supabase
    const formattedData = (data || []).map((donation: any) => ({
      id: donation.id,
      amount: donation.amount,
      currency: donation.currency,
      message: donation.message,
      status: donation.status,
      created_at: donation.created_at,
      donor_id: donation.donor_id,
      intern_id: donation.intern_id,
      donors: Array.isArray(donation.donors)
        ? donation.donors[0]
        : donation.donors,
      interns: Array.isArray(donation.interns)
        ? donation.interns[0]
        : donation.interns,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("All donations fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
