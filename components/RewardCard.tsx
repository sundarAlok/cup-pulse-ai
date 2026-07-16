"use client";

import { useState } from "react";

export default function RewardCard() {
  const [message, setMessage] = useState("");

  async function claimReward() {
    const res = await fetch("/api/rewards", {
      method: "POST",
    });

    const data = await res.json();

    setMessage(data.message);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Reward Claim
      </h2>

      <div className="mb-6">
        <p className="text-zinc-400">
          Eligible Reward
        </p>

        <p className="text-4xl font-bold text-green-400 mt-2">
          10 USDC
        </p>
      </div>

      <button
        onClick={claimReward}
        className="w-full bg-green-500 text-black font-semibold py-3 rounded-xl"
      >
        Claim Reward
      </button>

      {message && (
        <div className="mt-4 text-green-400">
          {message}
        </div>
      )}
    </div>
  );
}