import { NextRequest, NextResponse } from "next/server";
import { managerAuthService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the manager_session cookie
    const managerCookie = request.cookies.get("manager_session");

    if (!managerCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the manager data from the cookie
    const manager = JSON.parse(managerCookie.value);

    if (!manager || !manager.id) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Verify manager exists in database
    const managerData = await managerAuthService.getManager(manager.id);

    if (!managerData) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      manager: {
        id: managerData.id,
        email: managerData.email,
        full_name: managerData.full_name,
      },
    });
  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { error: "Session verification failed" },
      { status: 401 }
    );
  }
}
