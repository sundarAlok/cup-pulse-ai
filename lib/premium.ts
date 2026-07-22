export type PremiumReport = {
  title: string;
  unlockFeeUsd: number;
  summary: string;
  scouting: Array<{
    team: string;
    headline: string;
    signal: string;
    detail: string;
  }>;
  tacticalAnalysis: Array<{
    title: string;
    detail: string;
  }>;
  simulationSummary: {
    favorite: string;
    upsetChance: string;
    confidence: string;
  };
  matchBreakdown: Array<{
    fixture: string;
    insight: string;
  }>;
};

export function buildPremiumReport(): PremiumReport {
  return {
    title: "Premium World Cup Intelligence Report",
    unlockFeeUsd: 0.25,
    summary:
      "A premium-ready scouting package for advanced football intelligence, combining tactical patterns, simulation outlooks, and matchup-specific risk signals.",
    scouting: [
      {
        team: "Brazil",
        headline: "High press conditioning",
        signal: "Strong",
        detail: "Brazil's fullbacks are repeatedly joining the attack in the final third, creating overloads that punish narrow defences.",
      },
      {
        team: "Argentina",
        headline: "Midfield control creates turnovers",
        signal: "Strong",
        detail: "Argentina's central midfield wins the second ball repeatedly, giving them a high-value transition advantage.",
      },
      {
        team: "England",
        headline: "Set-piece threat remains elevated",
        signal: "Medium",
        detail: "England's aerial win rate from dead-ball situations is above tournament average and can swing tight knockout games.",
      },
    ],
    tacticalAnalysis: [
      {
        title: "Counter-press strategy",
        detail: "The most efficient teams in this field force a turnover inside the first 10 seconds after losing possession.",
      },
      {
        title: "Expected goals variance",
        detail: "Teams with a low possession share but high shot quality are creating a hidden edge in the knockout stage.",
      },
    ],
    simulationSummary: {
      favorite: "Brazil",
      upsetChance: "24%",
      confidence: "91%",
    },
    matchBreakdown: [
      {
        fixture: "Brazil vs France",
        insight: "Brazil's transition volume makes them slightly more resilient in high-pressure fixtures.",
      },
      {
        fixture: "Argentina vs England",
        insight: "A single set-piece swing could decide the result in a tightly balanced matchup.",
      },
    ],
  };
}
