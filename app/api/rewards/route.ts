import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getUserPoints,
  deductPoints,
} from "@/lib/db";
import { simulateRewardClaim } from "@/lib/injective";

const POINTS_PER_INJ = 100;

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
      eligibleReward: Math.floor(
        points / POINTS_PER_INJ
      ),
      rewardUnit: "INJ",
      conversionRate: `${POINTS_PER_INJ} Points = 1 INJ`,
    });
  } catch (error) {
    console.error(
      "Rewards GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        points: 0,
        eligibleReward: 0,
        rewardUnit: "INJ",
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

    const availableRewards =
      Math.floor(
        points / POINTS_PER_INJ
      );

    if (availableRewards <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You need at least 100 points to redeem 1 INJ.",
        },
        { status: 400 }
      );
    }

    const result =
      await simulateRewardClaim(
        availableRewards
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.message ||
            "Reward claim failed.",
        },
        { status: 400 }
      );
    }

    const pointsToDeduct =
      availableRewards *
      POINTS_PER_INJ;

    deductPoints(
      userId,
      pointsToDeduct
    );

    const updatedPoints =
      getUserPoints(userId);

    return NextResponse.json({
      success: true,
      message: `${availableRewards} INJ reward claimed successfully.`,
      claimedINJ:
        availableRewards,
      pointsDeducted:
        pointsToDeduct,
      remainingPoints:
        updatedPoints,
    });
  } catch (error) {
    console.error(
      "Rewards POST Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Reward claim failed.",
      },
      { status: 500 }
    );
  }
}