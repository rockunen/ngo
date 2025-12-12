import { NextRequest, NextResponse } from "next/server";
import { managerAuthService, managerSignInSchema } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = managerSignInSchema.safeParse(body);
    if (!validationResult.success) {
      // Extract first error message for user-friendly feedback
      const firstError = validationResult.error.errors[0];
      const errorMessage = `${firstError.path.join('.')}: ${firstError.message}`;
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const result = await managerAuthService.signIn(validationResult.data);

    // Set secure HTTP-only cookie for session
    const response = NextResponse.json(
      {
        success: true,
        message: "Manager signed in successfully",
        manager: result.manager,
      },
      { status: 200 }
    );

    // Set cookie with manager info (in production, use JWT)
    response.cookies.set("manager_session", JSON.stringify(result.manager), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Manager signin error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid credentials" },
      { status: 401 }
    );
  }
}
