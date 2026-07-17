import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generatePrediction(
  question: string
) {
  try {
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