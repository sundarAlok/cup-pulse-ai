"use client";

import { useEffect, useState } from "react";

export default function RewardCard() {
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPoints = async () => {
    try {
      const res = await fetch("/api/rewards");
      const data = await res.json();

      if (data.success) {
        setPoints(data.points);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  const fetchPoints = async () => {
    try {
      const res = await fetch("/api/rewards");
      const data = await res.json();

      if (data.success) {
        setPoints(data.points);
      }
    } catch (error) {
      console.error(error);
    }
  };

  void fetchPoints();
}, []);

const refreshPoints = async () => {
  try {
    const res = await fetch("/api/rewards");
    const data = await res.json();

    if (data.success) {
      setPoints(data.points);
    }
  } catch (error) {
    console.error(error);
  }
};

  const claimReward = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/rewards", {
        method: "POST",
      });

      const data = await res.json();

      setMessage(data.message);

      await loadPoints();
    } catch {
      setMessage("Reward claim failed.");
    } finally {
      setLoading(false);
    }
  };

  const redeemableUSDT = Math.floor(points / 100);
  const canClaim = redeemableUSDT > 0;


  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Redeemable Reward
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-600">
            {redeemableUSDT} USDT
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
          <span className="text-2xl">💰</span>
        </div>
      </div>

      <p className="mt-4 text-slate-500">
        Redeem rewards earned from predictions and fan participation.
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Current Points
          </span>

          <span className="font-semibold">
            {points}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-slate-500">
            Conversion Rate
          </span>

          <span className="font-semibold">
            100 → 1 USDT
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-slate-500">
            Available Reward
          </span>

          <span className="font-semibold text-green-600">
            {redeemableUSDT} USDT
          </span>
        </div>
      </div>

      <button
        onClick={claimReward}
        disabled={loading || !canClaim}
        className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Claiming..."
          : canClaim
          ? `Claim ${redeemableUSDT} USDT`
          : "Need 100 Points"}
      </button>

      {message && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}
    </div>
  );
}