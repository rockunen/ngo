import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ping Supabase to keep it alive
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    });

    if (!response.ok) {
      console.error("Supabase ping failed:", response.status);
      return NextResponse.json(
        { error: "Supabase ping failed" },
        { status: response.status }
      );
    }

    console.log("✅ Supabase keepalive ping successful");

    return NextResponse.json({
      success: true,
      message: "Supabase keepalive ping successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Keepalive ping error:", error);
    return NextResponse.json(
      { error: "Keepalive ping failed" },
      { status: 500 }
    );
  }
}
