import { NextResponse } from "next/server";
import { getMatches } from "@/lib/football";

export async function GET() {
  try {
    const matches = await getMatches();

    return NextResponse.json({
      success: true,
      matches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch matches",
      },
      { status: 500 }
    );
  }
}