import { NextResponse } from "next/server";
import { getMatches } from "@/lib/football";

export async function GET() {
  try {
    const matches = await getMatches();

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Matches API Error:", error);

    return NextResponse.json(
      {
        success: false,
        count: 0,
        matches: [],
        message:
          "Unable to fetch World Cup matches.",
      },
      { status: 500 }
    );
  }
}