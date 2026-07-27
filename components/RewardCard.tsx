"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Gift,
  Coins,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function RewardCard() {
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    let mounted = true;

    const initialize = async () => {
      try {
        const res = await fetch("/api/rewards");
        const data = await res.json();

        if (mounted && data.success) {
          setPoints(data.points);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void initialize();

    const refreshPoints = async () => {
      try {
        const res = await fetch("/api/rewards");
        const data = await res.json();

        if (mounted && data.success) {
          setPoints(data.points);
        }
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("points-updated", refreshPoints);

    return () => {
      mounted = false;
      window.removeEventListener("points-updated", refreshPoints);
    };
  }, []);

  const claimReward = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/rewards", {
        method: "POST",
      });

      const data = await res.json();
      setMessage(data.message || "Reward claim failed.");

      await loadPoints();
      window.dispatchEvent(new CustomEvent("points-updated"));
    } catch {
      setMessage("Reward claim failed.");
    } finally {
      setLoading(false);
    }
  };

  const redeemableINJ = Math.floor(points / 100);
  const canClaim = redeemableINJ > 0;

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
            Redeemable Reward
          </p>

          <h2 className="mt-2 text-5xl font-black text-emerald-600">
            {redeemableINJ} INJ
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
            from-emerald-500
            to-cyan-500
            text-white
            shadow-lg
          "
        >
          <Gift className="h-8 w-8" />
        </div>
      </div>

      <p className="mt-4 text-slate-500">
        Convert earned points into Injective
        ecosystem rewards.
      </p>

      {/* Conversion */}
      <div className="mt-8 rounded-3xl bg-slate-50 p-5">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-cyan-600" />

          <span className="font-semibold text-slate-900">
            Reward Conversion
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Current Points
            </span>

            <span className="font-bold text-slate-900">
              {points}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Conversion Rate
            </span>

            <span className="font-bold text-cyan-600">
              100 → 1 INJ
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Available Reward
            </span>

            <span className="font-bold text-emerald-600">
              {redeemableINJ} INJ
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-700">
            Next Reward Unlock
          </span>

          <span className="font-bold text-cyan-700">
            {100 - (points % 100)} pts
          </span>
        </div>
      </div>

      {/* Claim Button */}
      <button
        onClick={claimReward}
        disabled={loading || !canClaim}
        className="
          group
          mt-6
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-gradient-to-r
          from-cyan-500
          via-blue-600
          to-violet-600
          py-3.5
          font-semibold
          text-white
          transition-all
          duration-300
          hover:scale-[1.02]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading
          ? "Claiming..."
          : canClaim
          ? `Claim ${redeemableINJ} INJ`
          : "Need 100 Points"}

        {!loading && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>

      {/* Success/Error Message */}
      {message && (
        <div
          className="
            mt-5
            flex
            items-start
            gap-2
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-emerald-700
          "
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-sm text-slate-500">
          Rewards are simulated on the Injective
          Testnet environment for demonstration
          purposes.
        </p>
      </div>
    </div>
  );
}