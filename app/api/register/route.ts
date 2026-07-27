import { NextRequest, NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/firebaseStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const uid = typeof body?.uid === "string" ? body.uid.trim() : "";
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const secretWords = typeof body?.secretWords === "string" ? body.secretWords.trim() : "";
    const authProvider = typeof body?.authProvider === "string" ? body.authProvider : "email";

    if (!uid || !username || !email || !secretWords) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    await ensureUserProfile(uid, {
      email,
      username,
      displayName: username,
      secretWords,
      authProvider,
      points: 0,
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully.",
    });

    response.cookies.set("userId", uid, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}
