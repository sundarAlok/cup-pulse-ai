import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addUserPoints,
  deductUserPoints,
  getDemoMatchState,
  getDemoPrediction,
  getDemoPredictions,
  storeDemoPrediction,
} from "@/lib/firebaseStore";

type DemoPredictionPayload = {
  uid?: string;
  userId?: string | number;
  predictedWinner?: string;
};

export function resolveDemoPredictionSubmission(
  body: unknown,
  userIdFromCookie?: string | number | null
) {
  const payload =
    typeof body === "object" && body !== null
      ? (body as DemoPredictionPayload)
      : {};

  const userId: string = (
    typeof payload.uid === "string"
      ? payload.uid
      : typeof payload.userId === "string"
        ? payload.userId
        : typeof payload.userId === "number"
          ? String(payload.userId)
          : typeof userIdFromCookie === "string"
            ? userIdFromCookie
            : typeof userIdFromCookie === "number"
              ? String(userIdFromCookie)
              : ""
  ).trim();
  
  const predictedWinner = payload.predictedWinner;

  if (!userId || !["Team A", "Team X"].includes(predictedWinner ?? "")) {
    return { error: "Invalid prediction data" } as const;
  }

  return {
    userId,
    predictedWinner: predictedWinner as "Team A" | "Team X",
  };
}

export async function POST(
  request: NextRequest
) {
  try {
    const cookieStore = await cookies();
    const body = await request.json().catch(() => ({}));
    const resolvedSubmission = resolveDemoPredictionSubmission(
      body,
      cookieStore.get("userId")?.value ?? null
    );

    if ("error" in resolvedSubmission) {
      return NextResponse.json(
        {
          success: false,
          message: resolvedSubmission.error,
        },
        { status: 400 }
      );
    }

    const { userId, predictedWinner } = resolvedSubmission;

    const demoMatch = await getDemoMatchState();

    if (
      demoMatch.status === "FINISHED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Match already finished",
        },
        { status: 400 }
      );
    }

    const existingPrediction = await getDemoPrediction(userId);
    if (existingPrediction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Prediction already submitted",
        },
        { status: 400 }
      );
    }

    const updatedPoints = await deductUserPoints(userId, 1);

    await storeDemoPrediction(userId, predictedWinner);

    return NextResponse.json({
      success: true,
      message:
        "Prediction submitted",
      points: updatedPoints,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to submit prediction",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const demoMatch = await getDemoMatchState();

    if (
      demoMatch.status !== "FINISHED"
    ) {
      return NextResponse.json({
        success: true,
        finished: false,
      });
    }

    const predictions = await getDemoPredictions();
    const results = [];

    for (const prediction of predictions) {
      const correct =
        prediction.predictedWinner ===
        demoMatch.winner;

      if (correct) {
        await addUserPoints(
          prediction.uid,
          50
        );
      }

      results.push({
        userId: prediction.uid,
        predictedWinner:
          prediction.predictedWinner,
        winner: demoMatch.winner,
        correct,
      });
    }

    return NextResponse.json({
      success: true,
      finished: true,
      winner: demoMatch.winner,
      results,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}