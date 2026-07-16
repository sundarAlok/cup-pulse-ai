"use client";

import { useState } from "react";

export default function PredictionCard() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handlePredict() {
    if (!question) return;

    setLoading(true);

    const res = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: question }),
    });

    const data = await res.json();

    setResult(data.prediction);
    setLoading(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Who is likely to win Argentina vs Brazil?"
        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 outline-none"
        rows={4}
      />

      <button
        onClick={handlePredict}
        disabled={loading}
        className="mt-4 bg-cyan-500 text-black font-semibold px-6 py-3 rounded-xl"
      >
        {loading ? "Analyzing..." : "Generate Prediction"}
      </button>

      {result && (
        <div className="mt-6 border border-zinc-800 rounded-xl p-4">
          <h3 className="font-bold text-lg mb-3">
            AI Prediction
          </h3>

          <p>
            <strong>Prediction:</strong>{" "}
            {result.prediction}
          </p>

          <p>
            <strong>Confidence:</strong>{" "}
            {result.confidence}
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {result.reason}
          </p>
        </div>
      )}
    </div>
  );
}