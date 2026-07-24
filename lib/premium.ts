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
      "A premium-ready scouting package for advanced football intelligence, combining tactical patterns, simulation outlooks, and matchup-specific risk signals from the completed tournament.",
    scouting: [
      {
        team: "Spain",
        headline: "Midfield mastery unlocked the final",
        signal: "Dominant",
        detail: "Spain's midfield structure controlled tempo and limited Argentina's ability to build through the center.",
      },
      {
        team: "Argentina",
        headline: "Pressure remained relentless",
        signal: "Strong",
        detail: "Argentina kept the final tense with sustained counter-pressing sequences, earning high-value chances despite the narrow defeat.",
      },
      {
        team: "France",
        headline: "Resolved transition risk",
        signal: "Medium",
        detail: "France's defensive shape stabilized after early pressure, but they were ultimately edged by Spain's pace in wide areas.",
      },
    ],
    tacticalAnalysis: [
      {
        title: "Midfield balance pays off",
        detail: "Maintaining connection between defense and attack allowed Spain to control possession and force Argentina into rushed decisions.",
      },
      {
        title: "Transition value vs. sustained pressure",
        detail: "The final demonstrated that timed counter-attacks can overcome even the most disciplined defensive units when space is found early.",
      },
    ],
    simulationSummary: {
      favorite: "Spain",
      upsetChance: "18%",
      confidence: "93%",
    },
    matchBreakdown: [
      {
        fixture: "Spain vs Argentina",
        insight: "Spain's high pressing and wide overloads created the decisive edge in the final stages.",
      },
      {
        fixture: "Spain vs France",
        insight: "Spain's control of transitional pace limited France's counter-attacking threat.",
      },
    ],
  };
}
