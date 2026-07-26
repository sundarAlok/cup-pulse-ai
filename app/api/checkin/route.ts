import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addUserPoints,
  getCheckinRecord,
  getUserPoints,
  saveCheckinRecord,
} from "@/lib/firebaseStore";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const record = await getCheckinRecord(userId);

    if (record?.lastCheckin === today) {
      return NextResponse.json(
        {
          success: false,
          message: "Daily check-in already claimed.",
          totalPoints: record ? await getUserPoints(userId) : 0,
          streak: record?.streak ?? 0,
        },
        { status: 400 }
      );
    }

    const totalPoints = await addUserPoints(userId, 10);
    const streak = record ? record.streak + 1 : 1;

    await saveCheckinRecord(userId, today, streak);

    return NextResponse.json({
      success: true,
      pointsEarned: 10,
      totalPoints,
      streak,
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