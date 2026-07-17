import { NextResponse } from "next/server";
import { getMatches } from "@/lib/football";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeCode?: string;
  awayCode?: string;
  minute?: number | null;
};

export async function GET() {
  try {
    const matches = await getMatches();

    const liveMatches = matches.filter(
      (match: Match) =>
        match.status === "LIVE" ||
        match.status === "IN_PLAY" ||
        match.status === "PAUSED"
    );

    const upcomingMatches = matches.filter(
      (match: Match) =>
        match.status === "SCHEDULED" ||
        match.status === "TIMED"
    );

    const finishedMatches = matches.filter(
      (match: Match) =>
        match.status === "FINISHED"
    );

    return NextResponse.json({
      success: true,

      live: {
        count: liveMatches.length,
        matches: liveMatches,
      },

      upcoming: {
        count: upcomingMatches.length,
        matches: upcomingMatches,
      },

      finished: {
        count: finishedMatches.length,
        matches: finishedMatches,
      },

      total:
        liveMatches.length +
        upcomingMatches.length +
        finishedMatches.length,
    });
  } catch (error) {
    console.error(
      "Matches API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        live: {
          count: 0,
          matches: [],
        },

        upcoming: {
          count: 0,
          matches: [],
        },

        finished: {
          count: 0,
          matches: [],
        },

        total: 0,

        message:
          "Unable to fetch World Cup matches.",
      },
      {
        status: 500,
      }
    );
  }
}