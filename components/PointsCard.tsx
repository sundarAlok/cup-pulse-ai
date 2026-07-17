"use client";

import { useEffect, useState } from "react";

export default function PointsCard() {
  const [points, setPoints] = useState(0);
  const nextReward = 100;

  useEffect(() => {
    async function loadPoints() {
      try {
        const res = await fetch("/api/rewards");
        const data = await res.json();

        if (data.success) {
          setPoints(data.points);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadPoints();
  }, []);

  const progress =
    ((points % nextReward) / nextReward) * 100;

  const remaining =
    nextReward - (points % nextReward);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Fan Points
          </p>

          <h2 className="mt-1 text-4xl font-bold text-slate-900">
            {points}
          </h2>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white shadow-md">
          🏆
        </div>
      </div>

      <p className="mt-3 text-slate-500">
        Earn points through daily check-ins and match predictions.
      </p>

      {/* Progress */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-500">
            Next Reward
          </span>

          <span className="font-semibold text-slate-700">
            {remaining} points remaining
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Activity Rewards */}
      <div className="mt-8 space-y-3">
        <div className="flex justify-between rounded-xl bg-green-50 px-4 py-3">
          <span className="text-slate-700">
            Daily Check-In
          </span>

          <span className="font-bold text-green-600">
            +10
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-blue-50 px-4 py-3">
          <span className="text-slate-700">
            Prediction Submission
          </span>

          <span className="font-bold text-blue-600">
            +5
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-purple-50 px-4 py-3">
          <span className="text-slate-700">
            Correct Prediction
          </span>

          <span className="font-bold text-purple-600">
            +50
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-red-50 px-4 py-3">
          <span className="text-slate-700">
            Wrong Prediction
          </span>

          <span className="font-bold text-red-600">
            -20
          </span>
        </div>
      </div>
    </div>
  );
}