import Groq from "groq-sdk";
import { buildPremiumReport } from "./premium";
import { getMatches as fetchMatches } from "./football";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // Ignore env file issues and fall back to the existing process environment.
  }
}

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing. Set it in your environment or in .env.local."
    );
  }

  return new Groq({ apiKey });
}

export type PredictionResult = {
  prediction: string;
  confidence: string;
  reason: string;
  homeWin: number;
  awayWin: number;
  draw: number;
  homeForm: number;
  awayForm: number;
  homeTeam: string;
  awayTeam: string;
  homeRank?: number;
  awayRank?: number;
  homeElo?: number;
  awayElo?: number;
};

type FifaRankingEntry = {
  rank: number;
  team: string;
  points: number;
};

type TeamFormResult = {
  formScore: number;
  recentMatches: string[];
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

function extractJson(text: string) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in AI response.");
  }

  const jsonText = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonText);
  } catch {
    const fallbackMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!fallbackMatch) {
      throw new Error("No JSON object found in AI response.");
    }
    return JSON.parse(fallbackMatch[0]);
  }
}

function normalizeTeamName(teamName: string) {
  return teamName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.]/g, "")
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9' -]/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const teamAliases: Record<string, string[]> = {
  USA: ["United States", "USA", "U.S.A.", "United States of America"],
  "South Korea": ["Korea Republic", "South Korea", "Korea"],
  "North Korea": ["DPR Korea", "North Korea"],
  "Ivory Coast": ["Côte d'Ivoire", "Cote dIvoire", "Ivory Coast"],
  "IR Iran": ["Iran", "IR Iran"],
  England: ["England"],
  Spain: ["Spain"],
  France: ["France"],
  Germany: ["Germany"],
  Brazil: ["Brazil"],
  Argentina: ["Argentina"],
  Portugal: ["Portugal"],
  Netherlands: ["Netherlands", "Holland"],
  Croatia: ["Croatia"],
  Morocco: ["Morocco"],
  Senegal: ["Senegal"],
  Uruguay: ["Uruguay"],
  Mexico: ["Mexico"],
  Canada: ["Canada"],
  Japan: ["Japan"],
  Australia: ["Australia"],
  Qatar: ["Qatar"],
  SaudiArabia: ["Saudi Arabia"],
};

function candidateTeamNames(teamName: string) {
  const normalized = teamName.trim();

  const aliasEntry = Object.entries(teamAliases).find(([key]) => {
    const variants = teamAliases[key];
    return variants.some(
      (variant) => normalizeTeamName(variant) === normalizeTeamName(normalized)
    );
  });

  const variants = aliasEntry ? aliasEntry[1] : [normalized];

  return Array.from(
    new Set([normalized, ...variants].map((name) => name.trim()).filter(Boolean))
  );
}

export function extractTeamsFromQuestion(question: string) {
  const normalized = question.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [] as string[];
  }

  const matches: Array<{ team: string; index: number }> = [];

  for (const [canonicalName, aliases] of Object.entries(teamAliases)) {
    for (const alias of aliases) {
      const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i");
      const match = normalized.match(pattern);

      if (match?.index !== undefined) {
        matches.push({
          team: alias,
          index: match.index,
        });
      }
    }
  }

  if (matches.length >= 2) {
    const orderedMatches = matches
      .sort((a, b) => a.index - b.index)
      .slice(0, 2)
      .map((item) => item.team);

    return orderedMatches.filter(Boolean);
  }
  const patterns = [
    /\b([A-Za-z][A-Za-z .'’\-]*)\s+(?:vs|versus|v\.|v|against)\s+([A-Za-z][A-Za-z .'’\-]*)/i,
    /\b([A-Za-z][A-Za-z .'’\-]*)\s*-\s*([A-Za-z][A-Za-z .'’\-]*)/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return [match[1].trim(), match[2].trim()].filter(Boolean);
    }
  }

  return [] as string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeProbabilityValues(
  homeWin: number,
  awayWin: number,
  draw: number
) {
  const values = [homeWin, awayWin, draw].map((value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0;
  });

  const total = values.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return { homeWin: 33, awayWin: 33, draw: 34 };
  }

  const scaled = values.map((value) => (value / total) * 100);
  const rounded = scaled.map((value) => Math.round(value));
  const difference = 100 - rounded.reduce((sum, value) => sum + value, 0);
  rounded[rounded.length - 1] += difference;

  return {
    homeWin: rounded[0],
    awayWin: rounded[1],
    draw: rounded[2],
  };
}

function buildConfidenceValue(homeWin: number, awayWin: number) {
  const difference = Math.abs(homeWin - awayWin);
  const winnerShare = Math.max(homeWin, awayWin);
  const confidenceValue = Math.round(
    Math.min(95, Math.max(55, winnerShare + difference * 0.35))
  );

  return `${confidenceValue}%`;
}

function deriveEloScore(rank: number | undefined, formScore: number) {
  if (rank && rank > 0) {
    return Math.round(clamp(2800 - rank * 26 + (formScore - 50) * 6, 1000, 3000));
  }

  return Math.round(clamp(1500 + (formScore - 50) * 8, 1000, 3000));
}

function normalizePredictionPayload(
  parsed: Record<string, unknown>,
  fallback: PredictionResult,
  winner: string
): PredictionResult {
  const normalizedProbabilities = normalizeProbabilityValues(
    Number(parsed.homeWin ?? fallback.homeWin),
    Number(parsed.awayWin ?? fallback.awayWin),
    Number(parsed.draw ?? fallback.draw)
  );

  const parsedPrediction =
    typeof parsed.prediction === "string" ? parsed.prediction.trim() : "";

  const prediction =
    parsedPrediction &&
    [fallback.homeTeam, fallback.awayTeam].some(
      (team) => normalizeTeamName(team) === normalizeTeamName(parsedPrediction)
    )
      ? parsedPrediction
      : winner;

  const confidenceValue =
    typeof parsed.confidence === "string" && parsed.confidence.trim()
      ? parsed.confidence.trim()
      : fallback.confidence;

  const reason =
    typeof parsed.reason === "string" && parsed.reason.trim()
      ? parsed.reason.trim()
      : fallback.reason;

  const homeForm = clamp(
    Number(parsed.homeForm ?? fallback.homeForm),
    0,
    100
  );
  const awayForm = clamp(
    Number(parsed.awayForm ?? fallback.awayForm),
    0,
    100
  );

  return {
    prediction,
    confidence: confidenceValue,
    reason,
    homeWin: normalizedProbabilities.homeWin,
    awayWin: normalizedProbabilities.awayWin,
    draw: normalizedProbabilities.draw,
    homeForm,
    awayForm,
    homeTeam: fallback.homeTeam,
    awayTeam: fallback.awayTeam,
    homeRank: Number(parsed.homeRank ?? fallback.homeRank ?? 0),
    awayRank: Number(parsed.awayRank ?? fallback.awayRank ?? 0),
    homeElo: Number(parsed.homeElo ?? fallback.homeElo ?? 0),
    awayElo: Number(parsed.awayElo ?? fallback.awayElo ?? 0),
  };
}

function deriveFormScore(points: number, maxPoints = 15) {
  if (maxPoints <= 0) return 50;
  return clamp(Math.round((points / maxPoints) * 100), 0, 100);
}

async function fetchFifaRankings(): Promise<FifaRankingEntry[]> {
  try {
    const response = await fetch("https://www.fifa.com/en/world-rankings", {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    const plainText = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const entries: FifaRankingEntry[] = [];

    const patterns = [
      /(\d{1,3})\.\s+([A-Za-zÀ-ÿ .'’\-]+?)\.\s+[A-Z]{2,3}\.\s+(\d+(?:\.\d+)?)/g,
      /(\d{1,3})\.\s+([A-Za-zÀ-ÿ .'’\-]+?)\s+[A-Z]{2,3}\s+(\d+(?:\.\d+)?)/g,
    ];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(plainText)) !== null) {
        const rank = Number(match[1]);
        const team = match[2].trim();
        const points = Number(match[3]);

        if (
          Number.isFinite(rank) &&
          Number.isFinite(points) &&
          team.length > 1
        ) {
          entries.push({ rank, team, points });
        }
      }

      if (entries.length >= 20) break;
    }

    const unique = new Map<string, FifaRankingEntry>();

    for (const entry of entries) {
      const key = normalizeTeamName(entry.team);
      if (!unique.has(key)) {
        unique.set(key, entry);
      }
    }

    return Array.from(unique.values()).sort((a, b) => a.rank - b.rank);
  } catch (error) {
    console.error("Failed to fetch FIFA rankings:", error);
    return [];
  }
}

function findRankingForTeam(
  teamName: string,
  rankings: FifaRankingEntry[]
) {
  const candidates = candidateTeamNames(teamName).map(normalizeTeamName);

  for (const candidate of candidates) {
    const exact = rankings.find(
      (entry) => normalizeTeamName(entry.team) === candidate
    );
    if (exact) return exact;

    const partial = rankings.find((entry) =>
      normalizeTeamName(entry.team).includes(candidate)
    );
    if (partial) return partial;
  }

  return undefined;
}

async function getTeamFormFromMatches(
  teamName: string
): Promise<TeamFormResult> {
  try {
    const matches = await fetchMatches();

    const normalizedTeam = normalizeTeamName(teamName);

    const relevantMatches = matches
      .filter((match) => {
        const home = normalizeTeamName(match.homeTeam);
        const away = normalizeTeamName(match.awayTeam);
        return home === normalizedTeam || away === normalizedTeam;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);

    if (relevantMatches.length === 0) {
      return {
        formScore: 50,
        recentMatches: [],
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      };
    }

    let points = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    const recentMatches = relevantMatches.map((match) => {
      const isHome =
        normalizeTeamName(match.homeTeam) === normalizedTeam;

      const forGoals = isHome
        ? match.homeScore ?? 0
        : match.awayScore ?? 0;

      const againstGoals = isHome
        ? match.awayScore ?? 0
        : match.homeScore ?? 0;

      goalsFor += forGoals;
      goalsAgainst += againstGoals;

      if (
        match.homeScore === null ||
        match.awayScore === null
      ) {
        return `${match.homeTeam} vs ${match.awayTeam}`;
      }

      if (forGoals > againstGoals) {
        points += 3;
        return `W ${forGoals}-${againstGoals} vs ${
          isHome ? match.awayTeam : match.homeTeam
        }`;
      }

      if (forGoals === againstGoals) {
        points += 1;
        return `D ${forGoals}-${againstGoals} vs ${
          isHome ? match.awayTeam : match.homeTeam
        }`;
      }

      return `L ${forGoals}-${againstGoals} vs ${
        isHome ? match.awayTeam : match.homeTeam
      }`;
    });

    const formScore = deriveFormScore(points, relevantMatches.length * 3);

    return {
      formScore,
      recentMatches,
      goalsFor,
      goalsAgainst,
      points,
    };
  } catch (error) {
    console.error(`Failed to calculate form for ${teamName}:`, error);
    return {
      formScore: 50,
      recentMatches: [],
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };
  }
}

function calculatePredictionNumbers(
  homeRank: FifaRankingEntry | undefined,
  awayRank: FifaRankingEntry | undefined,
  homeFormScore: number,
  awayFormScore: number
) {
  const topPoints = Math.max(
    homeRank?.points ?? 0,
    awayRank?.points ?? 0,
    2100
  );

  const rankingStrengthHome = homeRank
    ? clamp(Math.round((homeRank.points / topPoints) * 100), 35, 100)
    : 50;

  const rankingStrengthAway = awayRank
    ? clamp(Math.round((awayRank.points / topPoints) * 100), 35, 100)
    : 50;

  const homeOverall = Math.round(
    rankingStrengthHome * 0.62 + homeFormScore * 0.38
  );
  const awayOverall = Math.round(
    rankingStrengthAway * 0.62 + awayFormScore * 0.38
  );

  const diff = homeOverall - awayOverall;

  const draw = clamp(Math.round(18 - Math.abs(diff) * 0.08), 8, 24);
  const winPool = 100 - draw;

  const homeShare = 1 / (1 + Math.exp(-(diff / 9)));
  let homeWin = Math.round(homeShare * winPool);
  let awayWin = winPool - homeWin;

  const normalized = normalizeProbabilityValues(homeWin, awayWin, draw);

  homeWin = normalized.homeWin;
  awayWin = normalized.awayWin;
  const finalDraw = normalized.draw;

  const prediction =
    homeWin >= awayWin ? "HOME" : "AWAY";

  const confidence = buildConfidenceValue(homeWin, awayWin);

  return {
    homeWin,
    awayWin,
    draw: finalDraw,
    confidence,
    prediction,
    homeOverall,
    awayOverall,
  };
}

export async function generatePremiumReport(team = "Brazil") {
  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are a football scouting analyst for a premium sports dashboard.
Return ONLY valid JSON with this schema:
{
  "title":"String",
  "summary":"String",
  "scouting":[{"team":"String","headline":"String","signal":"String","detail":"String"}],
  "tacticalAnalysis":[{"title":"String","detail":"String"}],
  "simulationSummary":{"favorite":"String","upsetChance":"String","confidence":"String"},
  "matchBreakdown":[{"fixture":"String","insight":"String"}]
}
`,
        },
        {
          role: "user",
          content: `Generate a premium scouting report for ${team}. Include tactical strengths, tactical weaknesses, key players, tournament outlook, and risk factors.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";
    const parsed = extractJson(text);

    return {
      title: parsed.title || "Premium World Cup Intelligence Report",
      summary: parsed.summary || buildPremiumReport().summary,
      scouting: parsed.scouting || buildPremiumReport().scouting,
      tacticalAnalysis:
        parsed.tacticalAnalysis || buildPremiumReport().tacticalAnalysis,
      simulationSummary:
        parsed.simulationSummary || buildPremiumReport().simulationSummary,
      matchBreakdown:
        parsed.matchBreakdown || buildPremiumReport().matchBreakdown,
    };
  } catch (error) {
    console.error("Groq Premium Report Error:", error);
    return buildPremiumReport();
  }
}

export async function generatePrediction(question: string): Promise<PredictionResult> {
  try {
    const prompt = question?.trim() || "";
    const teams = extractTeamsFromQuestion(prompt);

    if (teams.length < 2) {
      return {
        prediction: "Unavailable",
        confidence: "0%",
        reason: "Please ask about two teams, for example: Spain vs Argentina.",
        homeWin: 0,
        awayWin: 0,
        draw: 0,
        homeForm: 0,
        awayForm: 0,
        homeTeam: "Home Team",
        awayTeam: "Away Team",
      };
    }

    const homeTeam = teams[0];
    const awayTeam = teams[1];

    const fifaRankings = await fetchFifaRankings();
    const homeRank = findRankingForTeam(homeTeam, fifaRankings);
    const awayRank = findRankingForTeam(awayTeam, fifaRankings);

    const homeForm = await getTeamFormFromMatches(homeTeam);
    const awayForm = await getTeamFormFromMatches(awayTeam);

    const calculated = calculatePredictionNumbers(
      homeRank,
      awayRank,
      homeForm.formScore,
      awayForm.formScore
    );

    const selectedWinner =
      calculated.homeWin >= calculated.awayWin ? homeTeam : awayTeam;

    const fallbackReason = `${selectedWinner} is favoured based on the source context, FIFA ranking data, and recent form. ${homeTeam} form: ${homeForm.formScore}/100, ${awayTeam} form: ${awayForm.formScore}/100.`;

    const homeElo = deriveEloScore(homeRank?.rank, homeForm.formScore);
    const awayElo = deriveEloScore(awayRank?.rank, awayForm.formScore);

    const rankingInfo = [
      `${homeTeam}: rank ${homeRank ? `#${homeRank.rank}` : "unavailable"}, elo ${homeElo}, points ${homeRank ? homeRank.points.toFixed(2) : "unavailable"}`,
      `${awayTeam}: rank ${awayRank ? `#${awayRank.rank}` : "unavailable"}, elo ${awayElo}, points ${awayRank ? awayRank.points.toFixed(2) : "unavailable"}`,
    ].join("\n");

    const formInfo = [
      `${homeTeam}: form ${homeForm.formScore}/100, goals ${homeForm.goalsFor}-${homeForm.goalsAgainst}, recent: ${homeForm.recentMatches.join(" | ") || "no recent matches found"}`,
      `${awayTeam}: form ${awayForm.formScore}/100, goals ${awayForm.goalsFor}-${awayForm.goalsAgainst}, recent: ${awayForm.recentMatches.join(" | ") || "no recent matches found"}`,
    ].join("\n");

    const sourceContext = [
      "SOURCE_CONTEXT:",
      rankingInfo,
      formInfo,
      `Calculated baseline: homeWin ${calculated.homeWin}, awayWin ${calculated.awayWin}, draw ${calculated.draw}, confidence ${calculated.confidence}`,
    ].join("\n");

    const systemPrompt = `You are CupPulse AI, a football prediction engine.
Use ONLY the SOURCE_CONTEXT provided below.
Do NOT use memory.
Do NOT guess.
Do NOT add markdown.
Return ONLY valid JSON.

TASK:
Predict the winner of the match using the source context from FIFA rankings and recent form.

OUTPUT JSON FORMAT:
{
  "prediction": "Team Name",
  "confidence": "0-100%",
  "reason": "short football analysis using the source context",
  "homeWin": 0,
  "awayWin": 0,
  "draw": 0,
  "homeForm": 0,
  "awayForm": 0,
  "homeTeam": "Team Name",
  "awayTeam": "Team Name",
  "homeRank": 0,
  "awayRank": 0,
  "homeElo": 0,
  "awayElo": 0
}

RULES:
- homeWin + awayWin + draw must equal 100
- prediction must be one of the two teams
- confidence must match the stronger side
- lower FIFA rank number is better
- higher ELO points are better
- if there is not enough information, return the unavailable payload with zero values
`;

    const userPrompt = `USER QUESTION:
${prompt}

SOURCE_CONTEXT:
${sourceContext}`;

    let parsedPayload: Record<string, unknown> = {};

    try {
      const groq = getGroqClient();
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        top_p: 0.9,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const rawText = completion.choices[0]?.message?.content?.trim() || "";
      console.log("Prediction Request:", prompt);
      console.log("Groq Raw Response:", rawText);

      parsedPayload = extractJson(rawText) as Record<string, unknown>;
      console.log("Parsed Prediction:", parsedPayload);
    } catch (error) {
      console.error("Groq Error:", error);
      parsedPayload = {};
    }

    const baseResult: PredictionResult = {
      prediction: selectedWinner,
      confidence: calculated.confidence,
      reason: fallbackReason,
      homeWin: calculated.homeWin,
      awayWin: calculated.awayWin,
      draw: calculated.draw,
      homeForm: homeForm.formScore,
      awayForm: awayForm.formScore,
      homeTeam,
      awayTeam,
      homeRank: homeRank?.rank ?? 0,
      awayRank: awayRank?.rank ?? 0,
      homeElo,
      awayElo,
    };

    return normalizePredictionPayload(parsedPayload, baseResult, selectedWinner);
  } catch (error) {
    console.error("Prediction generation error:", error);

    return {
      prediction: "Unavailable",
      confidence: "0%",
      reason: "Prediction temporarily unavailable. Please try again.",
      homeWin: 0,
      awayWin: 0,
      draw: 0,
      homeForm: 0,
      awayForm: 0,
      homeTeam: "Home Team",
      awayTeam: "Away Team",
    };
  }
}