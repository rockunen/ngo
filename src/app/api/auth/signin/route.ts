import { NextRequest, NextResponse } from "next/server";
import { authService, signInSchema } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = signInSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const result = await authService.signIn(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        message: "Signed in successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid credentials" },
      { status: 401 }
    );
  }
}
