const API_URL = "https://api.football-data.org/v4";

export async function getMatches() {
  try {
    const response = await fetch(
      `${API_URL}/competitions/WC/matches?limit=12`,
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

    const data = await response.json();

    return (
      data.matches?.slice(0, 12).map((match: any) => ({
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
      })) || []
    );
  } catch (error) {
    console.error("Football API Error:", error);

    // Demo fallback for hackathon
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