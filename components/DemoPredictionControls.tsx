"use client";

import { useEffect, useState } from "react";
import {
  readDemoMatchState,
  registerDemoPrediction,
} from "@/lib/demoMatch";

type PointsState = {
  points: number;
  loading: boolean;
};

type Props = {
  homeTeam?: string;
  awayTeam?: string;
  variant?: "action" | "summary";
};

export default function DemoPredictionControls({
  homeTeam = "Team A",
  awayTeam = "Team X",
  variant = "action",
}: Props) {
  const [demoState, setDemoState] = useState(readDemoMatchState());
  const [pointsState, setPointsState] = useState<PointsState>({ points: 0, loading: true });

  useEffect(() => {
    const syncState = () => setDemoState(readDemoMatchState());
    syncState();
    window.addEventListener("storage", syncState);

    const refreshPoints = async () => {
      try {
        const res = await fetch("/api/rewards");
        const payload = await res.json();
        if (payload.success) {
          setPointsState({ points: Number(payload.points ?? 0), loading: false });
        } else {
          setPointsState((current) => ({ ...current, loading: false }));
        }
      } catch {
        setPointsState((current) => ({ ...current, loading: false }));
      }
    };

    refreshPoints();
    window.addEventListener("points-updated", refreshPoints);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("points-updated", refreshPoints);
    };
  }, []);

  const canPredict = !demoState.started && !demoState.resolved && !demoState.userPrediction;

  const handlePredict = async (team: string) => {
    try {
      const response = await fetch("/api/predictions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ predictedWinner: team }),
      });

      const payload = await response.json();

      if (!payload.success) {
        setDemoState((current) => ({
          ...current,
          message: payload.message || "Unable to save your prediction right now.",
        }));
        return;
      }

      const nextState = registerDemoPrediction(team);
      setDemoState({
        ...nextState,
        message: payload.message || nextState.message,
      });

      if (typeof payload.points === "number") {
        setPointsState({ points: payload.points, loading: false });
      } else {
        const res = await fetch("/api/rewards");
        const rewardPayload = await res.json();
        if (rewardPayload.success) {
          setPointsState({ points: Number(rewardPayload.points ?? 0), loading: false });
        }
      }

      window.dispatchEvent(new CustomEvent("points-updated"));
    } catch (error) {
      console.error(error);
      setDemoState((current) => ({
        ...current,
        message: "Unable to save your prediction right now.",
      }));
    }
  };

  if (variant === "summary") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Demo prediction</p>
            <p className="mt-1 text-sm text-slate-600">
              {demoState.userPrediction
                ? `Current selection: ${demoState.userPrediction}`
                : "No prediction made yet."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Points</p>
            <p className="text-xl font-bold text-slate-900">{pointsState.loading ? "..." : pointsState.points}</p>
          </div>
        </div>

        {demoState.message && (
          <p className="mt-3 text-sm text-slate-600">{demoState.message}</p>
        )}

        {demoState.started && !demoState.resolved && (
          <p className="mt-3 text-sm text-amber-700">
            Countdown is live. Your choice is locked until the match resolves.
          </p>
        )}

        {demoState.resolved && (
          <p className="mt-3 text-sm text-green-700">
            Match resolved. Result: {demoState.result || "Pending"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Demo Match Prediction</p>
      <p className="mt-1 text-sm text-slate-600">
        Choose one team for the demo match. Your choice is locked after the first vote. The action costs 1 point.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => handlePredict(homeTeam)}
          disabled={!canPredict}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Predict {homeTeam}
        </button>

        <button
          onClick={() => handlePredict(awayTeam)}
          disabled={!canPredict}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Predict {awayTeam}
        </button>
      </div>

      {demoState.message && (
        <p className="mt-3 text-sm text-slate-600">{demoState.message}</p>
      )}

      {demoState.userPrediction && (
        <p className="mt-2 text-sm font-medium text-green-700">
          Prediction locked for {demoState.userPrediction}.
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>Points cost: -1</span>
        <span>{pointsState.loading ? "Loading points..." : `Current points: ${pointsState.points}`}</span>
      </div>
    </div>
  );
}
