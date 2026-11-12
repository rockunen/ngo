import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase";
import {
  hashInternPassword,
  MAX_INTERN_PASSWORD_LENGTH,
  MIN_INTERN_PASSWORD_LENGTH,
} from "@/lib/intern-password";

const resetPasswordSchema = z.object({
  internId: z.string().uuid("Invalid intern ID"),
  newPassword: z
    .string()
    .min(
      MIN_INTERN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_INTERN_PASSWORD_LENGTH} characters`
    )
    .max(
      MAX_INTERN_PASSWORD_LENGTH,
      `Password must be ${MAX_INTERN_PASSWORD_LENGTH} characters or fewer`
    ),
});

function getManagerId(request: NextRequest) {
  const managerCookie = request.cookies.get("manager_session");

  if (!managerCookie) {
    return null;
  }

  try {
    const session = JSON.parse(managerCookie.value);
    return typeof session?.id === "string" ? session.id : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const managerId = getManagerId(request);
    if (!managerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = supabaseServer();
    const { data: manager, error: managerError } = await supabase
      .from("managers")
      .select("id")
      .eq("id", managerId)
      .eq("is_active", true)
      .maybeSingle();

    if (managerError) {
      console.error("Manager verification error:", managerError);
      return NextResponse.json(
        { error: "Failed to verify manager session" },
        { status: 500 }
      );
    }

    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validationResult = resetPasswordSchema.safeParse(
      await request.json()
    );

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            validationResult.error.errors[0]?.message || "Invalid reset request",
        },
        { status: 400 }
      );
    }

    const { internId, newPassword } = validationResult.data;
    const { data: intern, error: updateError } = await supabase
      .from("interns")
      .update({
        password_hash: hashInternPassword(newPassword),
        updated_at: new Date().toISOString(),
      })
      .eq("id", internId)
      .select("id, name")
      .maybeSingle();

    if (updateError) {
      console.error("Intern password reset error:", updateError);
      return NextResponse.json(
        { error: "Failed to reset intern password" },
        { status: 500 }
      );
    }

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    // End existing sessions so the new password takes effect for account access.
    const { error: sessionError } = await supabase
      .from("intern_sessions")
      .delete()
      .eq("intern_id", internId);

    if (sessionError) {
      console.error("Intern session invalidation error:", sessionError);
      return NextResponse.json(
        {
          error:
            "Password was reset, but existing sessions could not be signed out",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password reset for ${intern.name}`,
    });
  } catch (error) {
    console.error("Intern password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset intern password" },
      { status: 500 }
    );
  }
}
