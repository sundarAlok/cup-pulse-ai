const API_URL = "https://api.football-data.org/v4";

export type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
};

type FootballApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam?: {
    name?: string;
  };
  awayTeam?: {
    name?: string;
  };
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
};

export async function getMatches(): Promise<Match[]> {
  try {
    const response = await fetch(
      `${API_URL}/competitions/WC/matches`,
      {
        headers: {
          "X-Auth-Token":
            process.env.FOOTBALL_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Football API Error: ${response.status}`
      );
    }

    const data = (await response.json()) as {
      matches?: FootballApiMatch[];
    };

    return (
      data.matches?.slice(0, 50).map((match) => ({
        id: match.id,
        homeTeam:
          match.homeTeam?.name ?? "Unknown Team",
        awayTeam:
          match.awayTeam?.name ?? "Unknown Team",
        date: match.utcDate,
        status: match.status,
        homeScore:
          match.score?.fullTime?.home ?? null,
        awayScore:
          match.score?.fullTime?.away ?? null,
      })) ?? []
    );
  } catch (error) {
    console.error(
      "Football API Error:",
      error
    );

    // Hackathon fallback
    return [
      {
        id: 1,
        homeTeam: "Argentina",
        awayTeam: "Brazil",
        date: new Date().toISOString(),
        status: "SCHEDULED",
        homeScore: null,
        awayScore: null,
      },
      {
        id: 2,
        homeTeam: "France",
        awayTeam: "Germany",
        date: new Date().toISOString(),
        status: "SCHEDULED",
        homeScore: null,
        awayScore: null,
      },
      {
        id: 3,
        homeTeam: "Spain",
        awayTeam: "Portugal",
        date: new Date().toISOString(),
        status: "SCHEDULED",
        homeScore: null,
        awayScore: null,
      },
    ];
  }
}