"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Gift,
  Coins,
  Flame,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import PointsCard from "@/components/PointsCard";
import RewardCard from "@/components/RewardCard";

export default function RewardsPage() {
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState("");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function loadLiveStreak() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (data?.profile?.streak != null) {
          setStreak(Number(data.profile.streak) || 0);
        }
      } catch {
        const saved = localStorage.getItem("cupPulseStreak");
        if (saved) {
          const value = Number(saved);
          setTimeout(() => setStreak(value), 0);
        }
      }
    }

    void loadLiveStreak();
  }, []);

  async function handleCheckin() {
    try {
      setCheckinLoading(true);
      setCheckinMessage("");

      const res = await fetch("/api/checkin", {
        method: "POST",
      });

      const data = await res.json();

      setCheckinMessage(data.message);

      if (data.success) {
        setStreak(data.streak || 0);

        // refresh points cards
        window.dispatchEvent(
          new CustomEvent("points-updated")
        );
      }
    } catch {
      setCheckinMessage("Check-in failed");
    } finally {
      setCheckinLoading(false);
    }
  }

  useEffect(() => {
    localStorage.setItem(
      "cupPulseStreak",
      String(streak)
    );
  }, [streak]);

  return (
    <div className="px-4 py-28 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero */}
        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-slate-200/70
            bg-white/80
            p-8
            backdrop-blur-xl
            premium-shadow
          "
        >
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <Gift className="h-4 w-4" />
              Injective Fan Rewards
            </div>

            <h1 className="mt-4 text-4xl font-black text-slate-900 lg:text-5xl">
              Earn Points.
              <br />
              Redeem INJ Rewards.
            </h1>

            <p className="mt-4 max-w-3xl text-slate-600">
              Participate in daily activities, submit match
              predictions and earn reward points. Every 100
              points can be redeemed for 1 INJ on Injective
              Testnet.
            </p>
          </div>
        </section>

        {/* Daily Checkin */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div
            className="
              rounded-[32px]
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Daily Check-In
                </h2>

                <p className="mt-2 text-slate-500">
                  Claim your daily reward and keep your
                  streak alive.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
                <Coins className="h-7 w-7 text-cyan-600" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={handleCheckin}
                disabled={checkinLoading}
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-600
                  to-violet-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:scale-[1.02]
                  disabled:opacity-60
                "
              >
                {checkinLoading
                  ? "Claiming..."
                  : "Claim +10 Points"}
              </button>

              <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-orange-600">
                  {streak} Day Streak
                </span>
              </div>
            </div>

            {checkinMessage && (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-cyan-100
                  bg-cyan-50
                  p-4
                  text-cyan-700
                "
              >
                <CheckCircle2 className="h-5 w-5" />
                {checkinMessage}
              </div>
            )}
          </div>

          {/* Rules */}
          <div
            className="
              rounded-[32px]
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
            "
          >
            <h3 className="font-bold text-slate-900">
              Reward Rules
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-cyan-50 px-4 py-3">
                <span>Daily Check-In</span>
                <span className="font-bold text-cyan-600">
                  +10
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3">
                <span>Prediction Submitted</span>
                <span className="font-bold text-blue-600">
                  +5
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
                <span>Correct Prediction</span>
                <span className="font-bold text-green-600">
                  +50
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
                <span>Wrong Prediction</span>
                <span className="font-bold text-red-600">
                  -20
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Cards */}
        <section className="grid gap-6 lg:grid-cols-2">
          <PointsCard />
          <RewardCard />
        </section>

        {/* Reward Flow */}
        <section
          className="
            rounded-[32px]
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Reward Journey
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Daily Activity",
              "Predictions",
              "Earn Points",
              "Redeem INJ",
            ].map((step, index) => (
              <div
                key={step}
                className="
                  relative
                  rounded-3xl
                  bg-slate-50
                  p-6
                "
              >
                <div className="mb-3 text-sm font-semibold text-cyan-600">
                  Step {index + 1}
                </div>

                <h3 className="font-bold text-slate-900">
                  {step}
                </h3>

                {index < 3 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-400 md:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section
          className="
            rounded-[32px]
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-violet-600" />

            <h2 className="text-2xl font-bold text-slate-900">
              Reward History
            </h2>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center text-slate-500">
            No rewards claimed yet.
          </div>
        </section>
      </div>
    </div>
  );
}