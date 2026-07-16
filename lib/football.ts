const API_URL = "https://api.football-data.org/v4";

export async function getMatches() {
  try {
    const response = await fetch(
      `${API_URL}/competitions/WC/matches`,
      {
        headers: {
          "X-Auth-Token":
            process.env.FOOTBALL_API_KEY || "",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return (
      data.matches?.slice(0, 12).map((match: any) => ({
        id: match.id,
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        date: match.utcDate,
        status: match.status,
      })) || []
    );
  } catch (error) {
    console.error(error);

    return [];
  }
}