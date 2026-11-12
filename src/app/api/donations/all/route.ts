import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const DONATION_STATUSES = new Set(["all", "completed", "pending", "failed"]);
const MAX_SEARCH_LENGTH = 200;

function escapePostgrestPattern(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/"/g, '\\"');
}

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
    const parsedLimit = parseInt(searchParams.get("limit") || "20", 10);
    const parsedOffset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = Number.isNaN(parsedLimit)
      ? 20
      : Math.min(Math.max(parsedLimit, 1), 100);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
    const search = (searchParams.get("search") || "").trim();
    const status = searchParams.get("status") || "all";

    if (!DONATION_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid donation status" },
        { status: 400 }
      );
    }

    if (search.length > MAX_SEARCH_LENGTH) {
      return NextResponse.json(
        { error: `Search must be ${MAX_SEARCH_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    const searchPattern = search ? escapePostgrestPattern(search) : "";
    let matchingDonorIds: string[] = [];
    let matchingInternIds: string[] = [];

    if (search) {
      const [donorResult, internResult] = await Promise.all([
        supabase
          .from("donors")
          .select("id")
          .or(
            `full_name.ilike."%${searchPattern}%",email.ilike."%${searchPattern}%"`
          ),
        supabase
          .from("interns")
          .select("id")
          .ilike("name", `%${searchPattern}%`),
      ]);

      if (donorResult.error || internResult.error) {
        console.error("Donation search lookup error:", {
          donorError: donorResult.error,
          internError: internResult.error,
        });
        throw donorResult.error || internResult.error;
      }

      matchingDonorIds = (donorResult.data || []).map((donor) => donor.id);
      matchingInternIds = (internResult.data || []).map((intern) => intern.id);
    }

    // Filter before pagination so search covers the complete donation history.
    let query = supabase
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
        referral_code,
        donors:donor_id!inner(id, full_name, email),
        interns:intern_id(id, name)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      const searchFilters = [
        `referral_code.ilike."%${searchPattern}%"`,
      ];

      if (matchingDonorIds.length > 0) {
        searchFilters.push(`donor_id.in.(${matchingDonorIds.join(",")})`);
      }

      if (matchingInternIds.length > 0) {
        searchFilters.push(`intern_id.in.(${matchingInternIds.join(",")})`);
      }

      query = query.or(searchFilters.join(","));
    }

    const { data, count, error } = await query.range(
      offset,
      offset + limit - 1
    );

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
      referral_code: donation.referral_code,
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
