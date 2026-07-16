import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function generatePrediction(
  question: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a football prediction expert.

Return ONLY valid JSON:

{
  "prediction": "",
  "confidence": "",
  "reason": ""
}

Question:
${question}
`;

  const result = await model.generateContent(prompt);

  const text =
    result.response.text().replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  try {
    return JSON.parse(text);
  } catch {
    return {
      prediction: "Unknown",
      confidence: "50%",
      reason: "Unable to generate prediction.",
    };
  }
}