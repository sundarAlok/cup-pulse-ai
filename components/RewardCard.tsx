"use client";

import { useState } from "react";

export default function RewardCard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function claimReward() {
    try {
      setLoading(true);

      const res = await fetch("/api/rewards", {
        method: "POST",
      });

      const data = await res.json();

      setMessage(data.message);
    } catch {
      setMessage("Reward claim failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Eligible Reward
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-600">
            10 USDC
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
      </div>

      <p className="mt-4 text-slate-500">
        Claim your fan participation reward through the
        Injective CCTP reward flow simulation.
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          Reward Type
        </p>

        <p className="font-semibold text-slate-900">
          Cross-Chain USDC (Demo)
        </p>
      </div>

      <button
        onClick={claimReward}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Claiming..." : "Claim Reward"}
      </button>

      {message && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}
    </div>
  );
}