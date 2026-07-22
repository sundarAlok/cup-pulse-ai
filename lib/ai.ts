import Groq from "groq-sdk";
import { buildPremiumReport } from "./premium";

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
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      title: parsed.title || "Premium World Cup Intelligence Report",
      summary: parsed.summary || buildPremiumReport().summary,
      scouting: parsed.scouting || buildPremiumReport().scouting,
      tacticalAnalysis: parsed.tacticalAnalysis || buildPremiumReport().tacticalAnalysis,
      simulationSummary: parsed.simulationSummary || buildPremiumReport().simulationSummary,
      matchBreakdown: parsed.matchBreakdown || buildPremiumReport().matchBreakdown,
    };
  } catch (error) {
    console.error("Groq Premium Report Error:", error);
    return buildPremiumReport();
  }
}

export async function generatePrediction(
  question: string
) {
  try {
    const groq = getGroqClient();
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `
You are a football prediction analyst.

Return ONLY valid JSON.

{
  "prediction":"Team Name",
  "confidence":"78%",
  "reason":"Short football analysis."
}
`,
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

    const text =
      completion.choices[0]?.message?.content?.trim() ||
      "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      prediction:
        parsed.prediction || "Unknown",
      confidence:
        parsed.confidence || "50%",
      reason:
        parsed.reason ||
        "No analysis available.",
    };
  } catch (error) {
    console.error("Groq Error:", error);

    return {
      prediction: "Unavailable",
      confidence: "0%",
      reason:
        "Prediction service unavailable.",
    };
  }
}