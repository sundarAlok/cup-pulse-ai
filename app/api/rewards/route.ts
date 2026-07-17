import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getUserPoints,
  deductPoints,
} from "@/lib/db";
import { simulateRewardClaim } from "@/lib/injective";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = Number(
      cookieStore.get("userId")?.value
    );

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const points = getUserPoints(userId);

    return NextResponse.json({
      success: true,
      points,
      eligibleReward: Math.floor(points / 100),
      rewardUnit: "Testnet USDT",
    });
  } catch (error) {
    console.error("Rewards GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        points: 0,
        eligibleReward: 0,
      },
      { status: 500 }
    );
  }
}

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
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const points = getUserPoints(userId);

    const result =
      await simulateRewardClaim(points);

    if (!result.success) {
      return NextResponse.json(
        result,
        { status: 400 }
      );
    }

    deductPoints(userId, 100);

    const updatedPoints =
      getUserPoints(userId);

    return NextResponse.json({
      ...result,
      remainingPoints: updatedPoints,
    });
  } catch (error) {
    console.error(
      "Rewards POST Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Reward claim failed.",
      },
      { status: 500 }
    );
  }
}