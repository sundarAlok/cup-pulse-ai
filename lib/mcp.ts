import { getMatches as fetchMatches } from "./football";
import { generatePrediction } from "./ai";

export type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
};

export type TeamStats = {
  name: string;
  ranking: string;
  attack: number;
  defense: number;
  form: number;
  winProbability: string;
  expectedGoals: number;
  recent: string[];
  summary: string;
};

const teamProfiles: TeamStats[] = [
  {
    name: "Brazil",
    ranking: "#1",
    attack: 91,
    defense: 88,
    form: 91,
    winProbability: "76%",
    expectedGoals: 2.84,
    recent: ["W 3-1 vs France", "W 2-0 vs Argentina", "W 1-0 vs England"],
    summary:
      "Brazil is the top contender with elite attack and strong possession control.",
  },
  {
    name: "France",
    ranking: "#2",
    attack: 89,
    defense: 86,
    form: 88,
    winProbability: "68%",
    expectedGoals: 2.45,
    recent: ["W 2-1 vs England", "W 4-1 vs Spain", "L 1-2 vs Brazil"],
    summary:
      "France relies on fast transitions and clinical finishing from its attacking core.",
  },
  {
    name: "Argentina",
    ranking: "#3",
    attack: 90,
    defense: 84,
    form: 90,
    winProbability: "72%",
    expectedGoals: 2.72,
    recent: ["W 3-0 vs England", "W 2-1 vs Germany", "D 1-1 vs Spain"],
    summary:
      "Argentina combines strong offensive chemistry with dependable midfield control.",
  },
  {
    name: "England",
    ranking: "#4",
    attack: 86,
    defense: 83,
    form: 84,
    winProbability: "60%",
    expectedGoals: 2.18,
    recent: ["W 1-0 vs Portugal", "L 0-1 vs France", "W 2-1 vs Brazil"],
    summary:
      "England has a balanced squad with tactical discipline and strong set-piece danger.",
  },
];

const strengthMap: Record<string, number> = {
  Brazil: 96,
  France: 94,
  Argentina: 92,
  England: 90,
  Spain: 88,
  Germany: 87,
  Portugal: 86,
  Netherlands: 85,
};

const bracketSeeds = [
  ["Brazil", "Argentina"],
  ["France", "England"],
  ["Spain", "Germany"],
  ["Portugal", "Netherlands"],
];

const normalizeName = (teamName: string) =>
  teamName.trim().toLowerCase();

export async function getMatches(): Promise<Match[]> {
  return await fetchMatches();
}

export async function getLiveMatches(): Promise<Match[]> {
  const matches = await getMatches();
  return matches.filter((match) =>
    ["LIVE", "IN_PLAY"].includes(match.status)
  );
}

export async function getTeamStats(
  teamName: string
): Promise<TeamStats | null> {
  const normalized = normalizeName(teamName);
  return (
    teamProfiles.find(
      (team) =>
        normalizeName(team.name) === normalized
    ) ?? null
  );
}

export async function predictMatch(
  team1: string,
  team2: string
): Promise<{ prediction: string; confidence: string; reason: string }> {
  const prompt = `Predict the winner of the upcoming football match between ${team1} and ${team2}. Return the name of the winning team, the confidence percentage, and a short reason.`;
  return await generatePrediction(prompt);
}

const pickWeightedWinner = (
  a: { name: string },
  b: { name: string }
) => {
  const strengthA = strengthMap[a.name] ?? 75;
  const strengthB = strengthMap[b.name] ?? 75;
  const sample = Math.random() * (strengthA + strengthB);
  return sample <= strengthA ? a : b;
};

export function simulateTournament(
  runs = 100
): {
  champion: { name: string; probability: number }[];
  runnerUp: { name: string; probability: number }[];
  semifinalists: { name: string; probability: number }[];
  bracket: {
    quarterfinals: { home: string; away: string; winner: string }[];
    semifinals: { match: string; winner: string }[];
    final: { winner: string; runnerUp: string };
  };
} {
  const championCounts: Record<string, number> = {};
  const runnerUpCounts: Record<string, number> = {};
  const semiCounts: Record<string, number> = {};

  for (const team of Object.keys(strengthMap)) {
    championCounts[team] = 0;
    runnerUpCounts[team] = 0;
    semiCounts[team] = 0;
  }

  let finalResult = {
    champion: "",
    runnerUp: "",
    quarterfinals: [] as { home: string; away: string; winner: string }[],
    semifinals: [] as { match: string; winner: string }[],
  };

  for (let i = 0; i < runs; i += 1) {
    const qfWinners = bracketSeeds.map(([home, away]) => {
      const winner = pickWeightedWinner(
        { name: home },
        { name: away }
      );
      return {
        home,
        away,
        winner: winner.name,
      };
    });

    const semi1A = { name: qfWinners[0].winner };
    const semi1B = { name: qfWinners[1].winner };
    const semi2A = { name: qfWinners[2].winner };
    const semi2B = { name: qfWinners[3].winner };

    const semi1Winner = pickWeightedWinner(semi1A, semi1B).name;
    const semi2Winner = pickWeightedWinner(semi2A, semi2B).name;

    const finalWinner = pickWeightedWinner(
      { name: semi1Winner },
      { name: semi2Winner }
    ).name;
    const finalRunnerUp = finalWinner === semi1Winner ? semi2Winner : semi1Winner;

    championCounts[finalWinner] += 1;
    runnerUpCounts[finalRunnerUp] += 1;
    semiCounts[semi1Winner] += 1;
    semiCounts[semi2Winner] += 1;

    finalResult = {
      champion: finalWinner,
      runnerUp: finalRunnerUp,
      quarterfinals: qfWinners,
      semifinals: [
        { match: `${semi1A.name} vs ${semi1B.name}`, winner: semi1Winner },
        { match: `${semi2A.name} vs ${semi2B.name}`, winner: semi2Winner },
      ],
    };
  }

  const normalizeCounts = (
    counts: Record<string, number>
  ) =>
    Object.entries(counts)
      .map(([name, value]) => ({
        name,
        probability: Number(((value / runs) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.probability - a.probability);

  return {
    champion: normalizeCounts(championCounts),
    runnerUp: normalizeCounts(runnerUpCounts),
    semifinalists: normalizeCounts(semiCounts),
    bracket: {
      quarterfinals: finalResult.quarterfinals,
      semifinals: finalResult.semifinals,
      final: {
        winner: finalResult.champion,
        runnerUp: finalResult.runnerUp,
      },
    },
  };
}

export function getTournamentBracket() {
  const bracket = bracketSeeds.map(([home, away]) => ({
    home,
    away,
  }));

  return {
    name: "World Cup Bracket",
    rounds: [
      {
        name: "Quarter-finals",
        matches: bracket,
      },
      {
        name: "Semi-finals",
        matches: [
          { home: bracket[0].home, away: bracket[1].home },
          { home: bracket[2].home, away: bracket[3].home },
        ],
      },
      {
        name: "Final",
        matches: [
          { home: "Winner SF1", away: "Winner SF2" },
        ],
      },
    ],
  };
}

export async function getTopPredictions() {
  const matches = await getMatches();
  return matches.slice(0, 4).map((match) => ({
    match: `${match.homeTeam} vs ${match.awayTeam}`,
    predictedWinner:
      strengthMap[match.homeTeam] >=
      strengthMap[match.awayTeam]
        ? match.homeTeam
        : match.awayTeam,
    confidence: `${Math.floor(
      55 +
        Math.abs(
          (strengthMap[match.homeTeam] ?? 75) -
            (strengthMap[match.awayTeam] ?? 75)
        ) * 1.2
    )}%`,
  }));
}
