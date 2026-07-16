import { NextRequest, NextResponse } from "next/server";
import { generatePrediction } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const prediction = await generatePrediction(prompt);

    return NextResponse.json({
      success: true,
      prediction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Prediction failed",
      },
      { status: 500 }
    );
  }
}