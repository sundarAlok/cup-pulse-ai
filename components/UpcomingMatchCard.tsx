"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Trophy,
  TrendingUp,
} from "lucide-react";
import {
  readDemoMatchState,
  startDemoCountdown,
  resolveDemoMatch,
  registerDemoPrediction,
} from "@/lib/demoMatch";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
};

type Props = {
  match: Match;
};

const flagMap: Record<string, string> = {
  Argentina: "ar",
  Brazil: "br",
  France: "fr",
  Germany: "de",
  Spain: "es",
  Portugal: "pt",
  England: "gb",
  "Team A": "us",
  "Team X": "ca",
};

export default function UpcomingMatchCard({
  match,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);
  const [demoState, setDemoState] =
    useState(readDemoMatchState());
  const [readyToConfirm, setReadyToConfirm] =
    useState(false);

  useEffect(() => {
    const syncState = () => setDemoState(readDemoMatchState());
    syncState();
    window.addEventListener("storage", syncState);

    return () => window.removeEventListener("storage", syncState);
  }, []);

  useEffect(() => {
    if (!demoState.started || demoState.resolved || demoState.countdown === null) {
      return;
    }

    const timer = window.setInterval(() => {
      setDemoState((current) => {
        if (!current.countdown || current.countdown <= 1) {
          window.clearInterval(timer);
          const winner = match.homeTeam;
          const resolved = resolveDemoMatch(winner);

          void fetch(`/api/predictions/submit?winner=${encodeURIComponent(winner)}`)
            .then(async (response) => {
              const payload = await response.json();
              if (payload.success) {
                window.dispatchEvent(new CustomEvent("points-updated"));
              }
            })
            .catch((error) => console.error(error));

          return {
            ...current,
            ...resolved,
            countdown: 0,
          };
        }

        return {
          ...current,
          countdown: current.countdown - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [demoState.started, demoState.resolved, demoState.countdown, match.homeTeam]);

  const homeFlag =
    flagMap[match.homeTeam] || "un";

  const awayFlag =
    flagMap[match.awayTeam] || "un";

  const matchDate = new Date(match.date);

  const isShowcase =
    match.homeTeam === "Team A" &&
    match.awayTeam === "Team X";

  const homeImageSrc =
    match.homeTeam === "Team A"
      ? "/teamA.png"
      : `https://flagcdn.com/w80/${homeFlag}.png`;

  const awayImageSrc =
    match.awayTeam === "Team X"
      ? "/teamX.png"
      : `https://flagcdn.com/w80/${awayFlag}.png`;

  const canStartDemo = Boolean(demoState.userPrediction) && !demoState.started && !demoState.resolved;

  const handleStartDemo = () => {
    if (!demoState.userPrediction) {
      setDemoState((current) => ({
        ...current,
        message: "Make a prediction on the predictions page before starting the demo countdown.",
      }));
      return;
    }

    setReadyToConfirm(true);
  };

  const handleConfirmPrediction = () => {
    setDemoState(startDemoCountdown());
    setReadyToConfirm(false);
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Upcoming
          </span>

          {isShowcase && (
            <span className="ml-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Demo Match
            </span>
          )}
        </div>

        <button
          onClick={() =>
            setExpanded(!expanded)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-slate-100
            transition
            hover:bg-slate-200
          "
        >
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>

      {/* Teams */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-col items-center">
            <Image
              src={homeImageSrc}
              alt={match.homeTeam}
              width={70}
              height={70}
              className="h-16 w-16 rounded-full shadow"
            />

            <h3 className="mt-3 text-center text-lg font-bold">
              {match.homeTeam}
            </h3>
          </div>

          <div className="mx-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white shadow-lg">
              VS
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center">
            <Image
              src={awayImageSrc}
              alt={match.awayTeam}
              width={70}
              height={70}
              className="h-16 w-16 rounded-full shadow"
            />

            <h3 className="mt-3 text-center text-lg font-bold">
              {match.awayTeam}
            </h3>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Calendar size={14} />

          {matchDate.toLocaleDateString()}
        </div>
      </div>

      {/* Expand Area */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <h4 className="mb-4 font-bold text-slate-900">
            Match Overview
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp
                  size={16}
                />

                <span className="font-semibold">
                  Team Form
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {match.homeTeam} enters
                with strong recent form and
                attacking momentum.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Trophy size={16} />

                <span className="font-semibold">
                  Team Strength
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {match.awayTeam} has shown
                consistent defensive
                performances throughout the
                tournament.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-xs text-slate-500">
                Win Probability
              </p>

              <h4 className="mt-2 text-lg font-bold text-blue-600">
                {match.homeTeam} 56%
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Most likely winner
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-xs text-slate-500">
                Draw Chance
              </p>

              <h4 className="mt-2 text-2xl font-bold text-orange-500">
                18%
              </h4>
            </div>

            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-xs text-slate-500">
                Possession Edge
              </p>

              <h4 className="mt-2 text-2xl font-bold text-violet-600">
                +7%
              </h4>
            </div>
          </div>

          {/* Prediction CTA */}
          <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white">
            <p className="text-sm opacity-90">
              Demo Match Flow
            </p>

            <h4 className="mt-1 font-bold">
              {isShowcase ? "Start the demo countdown" : "Preview match insight"}
            </h4>

            <p className="mt-2 text-sm text-blue-100">
              {isShowcase
                ? "Press start, confirm you voted on the predictions page, and the match will resolve after 10 seconds."
                : "Based on recent form, attacking efficiency and tournament momentum."}
            </p>

            {isShowcase && (
              <div className="mt-4 space-y-3">
                {!demoState.started && !readyToConfirm && (
                  <button
                    onClick={handleStartDemo}
                    disabled={!canStartDemo}
                    className="w-full rounded-xl bg-white px-4 py-2 font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {canStartDemo ? "Start Countdown" : "Make a prediction first"}
                  </button>
                )}

                {!demoState.started && readyToConfirm && (
                  <div className="rounded-xl bg-white/10 p-3 text-sm">
                    <p className="font-semibold">
                      Confirm that your prediction is already set on the predictions page.
                    </p>
                    <p className="mt-2 text-blue-100">
                      Countdown will begin after you confirm.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setReadyToConfirm(false)}
                        className="flex-1 rounded-lg border border-white/30 px-3 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmPrediction}
                        className="flex-1 rounded-lg bg-white px-3 py-2 font-semibold text-blue-700"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                )}

                {demoState.started && !demoState.resolved && (
                  <div className="rounded-xl bg-white/10 p-3 text-sm">
                    <p className="font-semibold">
                      Demo countdown is live.
                    </p>
                    <p className="mt-2 text-blue-100">
                      Countdown: {demoState.countdown ?? 0}s
                    </p>
                  </div>
                )}

                {demoState.resolved && (
                  <div className="rounded-xl bg-white/10 p-3 text-sm">
                    <p className="font-semibold">
                      Demo match resolved.
                    </p>
                    <p className="mt-1 text-blue-100">
                      Result: {demoState.result || "Pending"}
                    </p>
                    <p className="mt-1 text-blue-100">
                      Points: {demoState.points}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}