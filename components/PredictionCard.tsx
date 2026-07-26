"use client";

import { useEffect, useState } from "react";
import {
  readDemoMatchState,
  registerDemoPrediction,
} from "@/lib/demoMatch";

interface PredictionResult {
  success?: boolean;
  prediction: string;
  confidence: string;
  reason: string;
  homeWin?: number;
  awayWin?: number;
  draw?: number;
  homeForm?: number;
  awayForm?: number;
  homeTeam?: string;
  awayTeam?: string;
  homeRank?: number;
  awayRank?: number;
  homeElo?: number;
  awayElo?: number;
}

export default function PredictionCard() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [demoState, setDemoState] = useState(readDemoMatchState());
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const syncState = () => setDemoState(readDemoMatchState());
    const refreshPoints = async () => {
      try {
        const res = await fetch("/api/rewards");
        const payload = await res.json();
        if (payload.success) {
          setPoints(Number(payload.points ?? 0));
        }
      } catch {
        // Ignore point refresh failures.
      }
    };

    syncState();
    refreshPoints();
    window.addEventListener("storage", syncState);
    window.addEventListener("points-updated", refreshPoints);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("points-updated", refreshPoints);
    };
  }, []);

  const exampleQuestions = [
    "Who is likely to win Brazil vs Germany?",
    "Predict France vs Portugal",
    "Who has a better chance between Spain and England?",
  ];

  async function handlePredict() {
    if (!question.trim()) {
      setError("Please enter a prediction question.");
      return;
    }

    if (demoState.started && !demoState.resolved) {
      setError("The demo prediction is locked while the countdown is live.");
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

      if (question.includes("Team A") || question.includes("Team X") || question.includes("Argentina") || question.includes("Spain")) {
        const nextState = registerDemoPrediction(data.prediction || "Team A");
        setDemoState(nextState);
      }

      if (typeof data.points === "number") {
        setPoints(data.points);
      } else {
        const rewardRes = await fetch("/api/rewards");
        const rewardPayload = await rewardRes.json();
        if (rewardPayload.success) {
          setPoints(Number(rewardPayload.points ?? 0));
        }
      }

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
          placeholder="Who is likely to win Brazil vs Germany?"
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePredict}
            disabled={loading || (demoState.started && !demoState.resolved)}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Generating Prediction..."
              : "Generate Prediction"}
          </button>
          <span className="text-sm text-slate-500">Current points: {points} • Cost: -7</span>
        </div>
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

      {demoState.started && !demoState.resolved && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Demo prediction locked. The countdown is live and additional votes are disabled until the match resolves.
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            AI Prediction Result
          </h3>

          {demoState.started && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">
                Demo match status: {demoState.resolved ? "Resolved" : "In progress"}
              </p>
              <p className="mt-1">
                {demoState.message || "Your prediction is being tracked for the demo match."}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Predicted Winner</p>
              <p className="mt-2 text-xl font-bold text-blue-600">
                {result.prediction}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Confidence</p>
              <p className="mt-2 text-xl font-bold text-green-600">
                {result.confidence}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Analysis</p>
              <p className="mt-2 text-sm text-slate-700">{result.reason}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">
                {result.homeTeam || "Home Team"} Win
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {result.homeWin ?? 0}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Draw</p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {result.draw ?? 0}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">
                {result.awayTeam || "Away Team"} Win
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {result.awayWin ?? 0}%
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Left Team</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {result.homeTeam || "Home Team"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Confidence: {result.homeWin ?? 0}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Elo Score: {result.homeElo ?? "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Right Team</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {result.awayTeam || "Away Team"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Confidence: {result.awayWin ?? 0}%
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Elo Score: {result.awayElo ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>{result.homeTeam || "Home Team"} Form</span>
                <span>{result.homeForm ?? 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${result.homeForm ?? 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>{result.awayTeam || "Away Team"} Form</span>
                <span>{result.awayForm ?? 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{ width: `${result.awayForm ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}