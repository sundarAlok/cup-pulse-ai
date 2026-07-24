"use client";

import { useState } from "react";

interface PredictionResult {
  prediction: string;
  confidence: string;
  reason: string;
}

export default function PredictionCard() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const exampleQuestions = [
    "Who is likely to win Argentina vs Spain?",
    "Predict France vs Germany",
    "Who has a better chance between Spain and Portugal?",
  ];

  async function handlePredict() {
    if (!question.trim()) {
      setError("Please enter a prediction question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
        }),
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to generate prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Who is likely to win Argentina vs Spain?"
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          onClick={handlePredict}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Generating Prediction..."
            : "Generate Prediction"}
        </button>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-500">
          Example Questions
        </p>

        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((item) => (
            <button
              key={item}
              onClick={() => setQuestion(item)}
              className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            AI Prediction Result
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 border border-slate-200">
              <p className="text-sm text-slate-500">
                Predicted Winner
              </p>

              <p className="mt-2 text-xl font-bold text-blue-600">
                {result.prediction}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border border-slate-200">
              <p className="text-sm text-slate-500">
                Confidence
              </p>

              <p className="mt-2 text-xl font-bold text-green-600">
                {result.confidence}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border border-slate-200">
              <p className="text-sm text-slate-500">
                Analysis
              </p>

              <p className="mt-2 text-sm text-slate-700">
                {result.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}