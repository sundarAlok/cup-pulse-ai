import { NextResponse } from "next/server";
import {
  getDemoMatchState,
  updateDemoMatchState,
} from "@/lib/firebaseStore";

export async function GET() {
  try {
    const matchState = await getDemoMatchState();
    return NextResponse.json({
      success: true,
      ...matchState,
    });
  } catch (error) {
    console.error("Error getting demo match state:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get match state",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Start a new demo match
    const updatedState = await updateDemoMatchState({
      status: "LIVE",
      winner: null,
      createdAt: new Date().toISOString(),
    });

    // Schedule finishing the match after 10 seconds
    setTimeout(async () => {
      try {
        // Determine a winner randomly
        const winner = Math.random() > 0.5 ? "Team A" : "Team X";
        await updateDemoMatchState({
          status: "FINISHED",
          winner,
        });
      } catch (error) {
        console.error("Error finishing demo match:", error);
      }
    }, 10000);

    return NextResponse.json({
      success: true,
      message: "Demo match started",
      ...updatedState,
    });
  } catch (error) {
    console.error("Error starting demo match:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to start match",
      },
      { status: 500 }
    );
  }
}