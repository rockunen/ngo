import { NextRequest, NextResponse } from "next/server";
import { authService, signUpSchema } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = signUpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const result = await authService.signUp(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully. Please verify your email.",
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 400 }
    );
  }
}
