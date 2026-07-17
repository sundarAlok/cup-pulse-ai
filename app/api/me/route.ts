import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  const user = getUserById(Number(userId));

  if (!user) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      points: user.points,
    },
  });
}