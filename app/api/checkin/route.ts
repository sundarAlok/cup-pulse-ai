import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addPoints } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const userId = Number(
      cookieStore.get("userId")?.value
    );

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const updatedPoints = addPoints(
      userId,
      10
    );

    return NextResponse.json({
      success: true,
      pointsEarned: 10,
      totalPoints: updatedPoints,
      message: "Daily check-in successful",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Check-in failed",
      },
      { status: 500 }
    );
  }
}