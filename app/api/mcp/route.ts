import { NextRequest, NextResponse } from "next/server";
import {
  getMatches,
  getLiveMatches,
  getTeamStats,
  predictMatch,
  simulateTournament,
  getTournamentBracket,
  getTopPredictions,
} from "@/lib/mcp";

type MCPRequestBody = {
  action?: string;
  team?: string;
  team1?: string;
  team2?: string;
  runs?: number;
};

async function readBody(req: NextRequest): Promise<MCPRequestBody> {
  try {
    const text = await req.text();
    if (!text.trim()) {
      return {};
    }
    return JSON.parse(text) as MCPRequestBody;
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const body = await readBody(req);
  const resolvedAction = action ?? body.action;

  if (!resolvedAction) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing action parameter. Try ?action=getMatches or POST with { action: 'predictMatch' }.",
      },
      { status: 400 }
    );
  }

  try {
    switch (resolvedAction) {
      case "getMatches": {
        const matches = await getMatches();
        return NextResponse.json({ success: true, matches });
      }
      case "getLiveMatches": {
        const liveMatches = await getLiveMatches();
        return NextResponse.json({ success: true, liveMatches });
      }
      case "getTeamStats": {
        const team = url.searchParams.get("team") ?? body.team;
        if (!team) {
          return NextResponse.json(
            {
              success: false,
              error: "Missing team parameter.",
            },
            { status: 400 }
          );
        }
        const details = await getTeamStats(team);
        return NextResponse.json({ success: true, details });
      }
      case "getTournamentBracket": {
        const bracket = getTournamentBracket();
        return NextResponse.json({ success: true, bracket });
      }
      case "getTopPredictions": {
        const topPredictions = await getTopPredictions();
        return NextResponse.json({ success: true, topPredictions });
      }
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${resolvedAction}`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("MCP route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await readBody(req);
    const action = body.action;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing action field. Try { action: 'predictMatch', team1: 'Brazil', team2: 'France' }.",
        },
        { status: 400 }
      );
    }

    switch (action) {
      case "predictMatch": {
        const team1 = body.team1?.trim();
        const team2 = body.team2?.trim();

        if (!team1 || !team2) {
          return NextResponse.json(
            {
              success: false,
              error: "Missing team1 or team2.",
            },
            { status: 400 }
          );
        }

        const prediction = await predictMatch(team1, team2);
        return NextResponse.json({ success: true, prediction });
      }
      case "simulateTournament": {
        const runs = Number(body.runs) || 100;
        const result = simulateTournament(runs);
        return NextResponse.json({ success: true, result });
      }
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("MCP POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
