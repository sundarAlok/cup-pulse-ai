import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generatePrediction } from "@/lib/ai";
import { deductUserPoints, storePredictionLog } from "@/lib/firebaseStore";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json().catch(() => ({}));
    const userId = cookieStore.get("userId")?.value;
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          prediction: "Unavailable",
          confidence: "0%",
          reason: "Please enter a valid question.",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          prediction: "Unavailable",
          confidence: "0%",
          reason: "Please log in to use AI predictions.",
        },
        { status: 401 }
      );
    }

    const result = await generatePrediction(prompt);
    const updatedPoints = await deductUserPoints(userId, 7);
    await storePredictionLog(userId, {
      prompt,
      prediction: result.prediction,
      confidence: result.confidence,
      reason: result.reason,
    });

    return NextResponse.json({
      success: true,
      ...result,
      points: updatedPoints,
    });
  } catch (error) {
    console.error("Prediction API Error:", error);

    return NextResponse.json(
      {
        success: false,
        prediction: "Unavailable",
        confidence: "0%",
        reason: "Prediction service temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}