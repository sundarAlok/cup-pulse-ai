import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/firebaseStore";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  const user = await getUserProfile(userId);

  if (!user) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.uid,
      username: user.username || user.displayName || user.email,
      points: user.points ?? 0,
      photoURL: user.photoURL ?? "",
    },
  });
}