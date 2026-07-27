import { NextRequest, NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/firebaseStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const uid = typeof body?.uid === "string" ? body.uid.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
    const photoURL = typeof body?.photoURL === "string" ? body.photoURL : "";
    const secretWords = typeof body?.secretWords === "string" ? body.secretWords.trim() : "";
    const authProvider = typeof body?.authProvider === "string" ? body.authProvider : "email";

    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid Firebase user id is required.",
        },
        { status: 400 }
      );
    }

    await ensureUserProfile(uid, {
      email,
      username: username || displayName || email.split("@")[0] || `user-${uid.slice(0, 6)}`,
      displayName: displayName || username || email.split("@")[0] || `user-${uid.slice(0, 6)}`,
      photoURL: photoURL || null,
      secretWords,
      authProvider,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
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
        message: "Login failed.",
      },
      { status: 500 }
    );
  }
}
