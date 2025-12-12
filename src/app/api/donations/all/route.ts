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

    // Fetch all donations with pagination
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
        donor_id
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Donations query error:", error);
      throw error;
    }

    // Fetch related donor data
    const donorIds = [...new Set(data?.map((d) => d.donor_id) || [])];

    let donorsMap: Record<string, any> = {};

    if (donorIds.length > 0) {
      const { data: donors, error: donorsError } = await supabase
        .from("donors")
        .select("id, full_name, email")
        .in("id", donorIds);

      if (!donorsError && donors) {
        donorsMap = Object.fromEntries(donors.map((d) => [d.id, d]));
      }
    }

    // Format the response with related data
    const formattedData = (data || []).map((donation) => ({
      ...donation,
      donors: donorsMap[donation.donor_id] || null,
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
