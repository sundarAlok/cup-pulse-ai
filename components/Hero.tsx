"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Brain,
  Activity,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-10 pb-40">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[112.5px] w-[112.5px] -translate-x-1/2 rounded-full bg-cyan-200/30 blur-[30px]" />
        <div className="absolute -left-24 top-24 h-[75px] w-[75px] rounded-full bg-blue-200/20 blur-[25px]" />
        <div className="absolute -right-24 top-24 h-[75px] w-[75px] rounded-full bg-violet-200/20 blur-[25px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          {/* LEFT SIDE */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 backdrop-blur-xl px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                <Trophy className="h-3.5 w-3.5 text-cyan-600" />
                FIFA World Cup 2026 Intelligence Platform
              </div>

              {/* Heading */}
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight text-slate-900">
                World Cup
                <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Intelligence
                </span>
                Layer
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                Live match intelligence, AI predictions, tournament
                simulations, and fan rewards powered by advanced analytics and
                Injective infrastructure.
              </p>

              {/* CTA Buttons */}
              <div className="mt-12 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-slate-900
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                  "
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/predictions"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-200
                    bg-white/80
                    backdrop-blur-xl
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-slate-800
                    transition-all
                    hover:bg-white
                  "
                >
                  AI Prediction Center
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["48", "Teams"],
                  ["104", "Matches"],
                  ["2.4M", "Predictions"],
                  ["98%", "Accuracy"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="
                      rounded-2xl
                      border
                      border-white/70
                      bg-white/75
                      backdrop-blur-xl
                      p-3
                      shadow-md
                    "
                  >
                    <div className="text-xl font-bold text-slate-900">
                      {value}
                    </div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="
                rounded-3xl
                border
                border-white/70
                bg-white/80
                backdrop-blur-2xl
                p-6
                shadow-[0_20px_50px_rgba(15,23,42,0.08)]
              "
            >
              {/* Match Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Live Match</p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Brazil 2 — 1 France
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    84 • Semi Final
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">AI Win Prob.</p>

                  <div className="text-2xl font-black text-cyan-600">
                    62%
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-cyan-600" />
                    <span className="text-sm font-medium">
                      Prediction Confidence
                    </span>
                  </div>

                  <span className="text-sm font-bold">89%</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">
                      Momentum Index
                    </span>
                  </div>

                  <span className="text-sm font-bold">+17</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium">
                      Expected Goals
                    </span>
                  </div>

                  <span className="text-sm font-bold">2.48</span>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-600">
                  <span>Brazil Win Probability</span>
                  <span>62%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: "62%" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}