"use client";

import { useCallback, useEffect, useState } from "react";
import { Trophy, Coins, Target, Flame } from "lucide-react";

export default function PointsCard() {
  const [points, setPoints] = useState(0);

  const nextReward = 100;

  const loadPoints = useCallback(async () => {
    try {
      const res = await fetch("/api/rewards");
      const data = await res.json();

      if (data.success) {
        setPoints(data.points);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

useEffect(() => {
  const refreshPoints = () => {
    loadPoints();
  };

  window.addEventListener(
    "points-updated",
    refreshPoints
  );

  return () => {
    window.removeEventListener(
      "points-updated",
      refreshPoints
    );
  };
}, [loadPoints]);

const [hasLoaded, setHasLoaded] =
  useState(false);

useEffect(() => {
  if (hasLoaded) return;

  const fetchData = async () => {
    await loadPoints();
    setHasLoaded(true);
  };

  fetchData();
}, [hasLoaded, loadPoints]);

  const progress =
    ((points % nextReward) / nextReward) * 100;

  const remaining =
    nextReward - (points % nextReward);

  return (
    <div
      className="
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Fan Points
          </p>

          <h2 className="mt-2 text-5xl font-black text-slate-900">
            {points}
          </h2>
        </div>

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-cyan-500
            via-blue-600
            to-violet-600
            text-white
            shadow-lg
          "
        >
          <Trophy className="h-8 w-8" />
        </div>
      </div>

      <p className="mt-4 text-slate-500">
        Earn points through daily check-ins and
        accurate match predictions.
      </p>

      {/* Progress */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Progress to next reward
          </span>

          <span className="text-sm font-semibold text-slate-700">
            {remaining} points remaining
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-cyan-500
              via-blue-600
              to-violet-600
              transition-all
              duration-700
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-cyan-50 p-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-cyan-600" />

            <span className="text-sm font-medium text-slate-600">
              Daily Check-In
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-cyan-600">
            +10 Points
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />

            <span className="text-sm font-medium text-slate-600">
              Prediction Entry
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-blue-600">
            +5 Points
          </p>
        </div>
      </div>

      {/* Rewards Breakdown */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
          <span className="text-slate-700">
            Correct Prediction
          </span>

          <span className="font-bold text-green-600">
            +50
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
          <span className="text-slate-700">
            Wrong Prediction
          </span>

          <span className="font-bold text-red-600">
            -20
          </span>
        </div>
      </div>

      {/* Reward Milestone */}
      <div
        className="
          mt-6
          rounded-3xl
          border
          border-violet-100
          bg-gradient-to-r
          from-violet-50
          to-cyan-50
          p-5
        "
      >
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-violet-600" />

          <span className="font-semibold text-slate-900">
            Reward Milestone
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Every <strong>100 points</strong> can be
          redeemed for <strong>1 INJ</strong> on
          Injective Testnet.
        </p>
      </div>
    </div>
  );
}