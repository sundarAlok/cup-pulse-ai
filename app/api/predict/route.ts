import { NextRequest, NextResponse } from "next/server";
import { generatePrediction } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        {
          prediction: "Unavailable",
          confidence: "0%",
          reason: "Please enter a valid question.",
        },
        { status: 400 }
      );
    }

    const result = await generatePrediction(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Prediction API Error:", error);

    return NextResponse.json(
      {
        prediction: "Unavailable",
        confidence: "0%",
        reason: "Prediction service temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}