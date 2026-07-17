import { NextResponse } from "next/server";
import {
  getUserPoints,
  deductPoints,
} from "@/lib/db";
import { simulateRewardClaim } from "@/lib/injective";

export async function GET() {
  try {
    const points = getUserPoints();

    return NextResponse.json({
      success: true,
      points,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        points: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const points = getUserPoints();

    const result =
      await simulateRewardClaim(points);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 400,
      });
    }

    deductPoints(100);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Reward claim failed.",
      },
      { status: 500 }
    );
  }
}