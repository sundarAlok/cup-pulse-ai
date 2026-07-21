"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import Hero from "../components/Hero";
import GlassCard from "../components/GlassCard";
import TournamentGraph from "../components/TournamentGraph";
import TeamAnalyticsPanel, { type TeamAnalyticsData } from "../components/TeamAnalyticsPanel";

export default function HomePage() {
  const [activeTeam, setActiveTeam] = useState<TeamAnalyticsData | null>(null);

  return (
    <div className="relative overflow-hidden pb-24">
      <AnimatedBackground />

      <main className="relative">
        <Hero />

        <div className="max-w-7xl mx-auto w-full px-6 space-y-12">
          {/* Live Match Intelligence */}

          {/* Tournament Intelligence Graph */}
          <section>
            <TournamentGraph onTeamSelect={setActiveTeam} />
          </section>

          {/* Team Analytics Panel */}
          <section>
            <TeamAnalyticsPanel team={activeTeam} />
          </section>

          {/* AI Prediction Center */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">AI Prediction Center</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Next Match Prediction</div>
                <div className="mt-2 font-bold">Spain vs Germany</div>
                <div className="mt-1 text-xs text-[var(--muted)]">AI: Spain 54% • Confidence: 68%</div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Top Predictions</div>
                <ul className="mt-2 text-sm">
                  <li>Brazil to win group • 62%</li>
                  <li>England upset vs France • 22%</li>
                </ul>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Model Insights</div>
                <div className="mt-2 text-sm">Feature importance: form, xG, injuries, travel fatigue.</div>
              </GlassCard>
            </div>
          </section>

          {/* Tournament Simulator CTA */}
          <section>
            <GlassCard className="grid gap-6 md:grid-cols-[1.3fr_0.9fr] items-stretch p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-lg">⚡</span>
                  <span>AI-driven tournament simulation</span>
                </div>

                <h3 className="text-3xl font-semibold text-slate-900">Tournament Simulator</h3>
                <p className="max-w-xl text-base leading-7 text-slate-600">Run AI-powered tournament models, compare likely champions, and explore bracket probability in one fast simulation workflow.</p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reality score</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">94%</p>
                    <p className="mt-2 text-sm text-slate-600">AI prediction alignment across tournament models.</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Champion odds</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">Brazil</p>
                    <p className="mt-2 text-sm text-slate-600">Current favorite in model runs.</p>
                  </div>
                </div>

                <Link href="/simulator" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
                  Open Simulator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </GlassCard>
          </section>

          {/* Top Teams Analytics */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Top Teams Analytics</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { name: "Brazil", stat: "Attack 88" },
                { name: "France", stat: "Defense 85" },
                { name: "Argentina", stat: "Form 82" },
                { name: "England", stat: "Depth 80" },
              ].map((t) => (
                <GlassCard key={t.name} className="text-center">
                  <div className="text-sm text-[var(--muted)]">{t.name}</div>
                  <div className="mt-2 font-bold">{t.stat}</div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Fan Rewards Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Fan Rewards</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Your Points</div>
                <div className="mt-2 text-3xl font-extrabold">1,240</div>
                <div className="mt-2 text-xs text-[var(--muted)]">Keep predicting to earn more rewards.</div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Top Rewards</div>
                <ul className="mt-2 text-sm">
                  <li>Merch Pack • 5000 pts</li>
                  <li>VIP Experience • 25000 pts</li>
                </ul>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Connect Wallet</div>
                <div className="mt-2 text-sm">Link your Injective wallet to claim on-chain rewards.</div>
              </GlassCard>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-6 text-sm text-[var(--muted)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>© {new Date().getFullYear()} CupPulse AI</div>
              <div className="flex gap-4">
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/privacy" className="hover:underline">Privacy</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}