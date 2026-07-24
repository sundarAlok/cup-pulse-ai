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

          {/* Tournament Simulator CTA */}
          <section>
            <GlassCard className="grid gap-6 md:grid-cols-[1.3fr_0.9fr] items-stretch p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-600 text-white text-lg">⚡</span>
                  <span>AI-driven tournament simulation</span>
                </div>

                <h3 className="text-3xl font-semibold text-slate-900">Tournament Simulator</h3>
                <p className="max-w-xl text-base leading-7 text-slate-600">Run AI-powered tournament models, compare likely champions, and explore bracket probability in one fast simulation workflow.</p>
              </div>

              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reality score</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">94%</p>
                    <p className="mt-2 text-sm text-slate-600">AI prediction alignment across tournament models.</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Champion odds</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">Spain</p>
                    <p className="mt-2 text-sm text-slate-600">Model consensus after final match performance.</p>
                  </div>
                </div>

                <Link href="/simulator" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
                  Open Simulator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </GlassCard>
          </section>

          {/* Premium Intelligence Banner */}
          <section>
            <GlassCard className="overflow-hidden rounded-4xl border border-slate-200/80 bg-linear-to-r from-slate-900 via-slate-800 to-cyan-900 p-8 text-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-200/20 px-3 py-1 text-sm font-semibold text-cyan-700">
                    Premium Intelligence
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold text-lack sm:text-3xl text-slate-900">Unlock elite scouting reports, and tactical analysis.</h3>
                  <p className="mt-4 text-base leading-7 text-slate-700">Pay 1 INJ on Injective testnet, verify the transaction, and unlock a premium World Cup report built for your hackathon demo.</p>
                </div>

                <div className="flex flex-row gap-3 sm:flex-row">
                  <Link href="/premium" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Open Premium Insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Latest World Cup Insights</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard>
                <div className="text-sm font-medium text-slate-600">Champion</div>
                <div className="mt-2 font-bold text-slate-900">Spain</div>
                <div className="mt-1 text-xs text-slate-600">Clinched the title with solid possession and disciplined transition play.</div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm font-medium text-slate-600">Runner-up</div>
                <div className="mt-2 font-bold text-slate-900">Argentina</div>
                <div className="mt-1 text-xs text-slate-600">Runner-up after a narrow final, driven by late pressure and attacking urgency.</div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm font-medium text-slate-600">Final Score</div>
                <div className="mt-2 font-bold text-slate-900">2 — 1</div>
                <div className="mt-1 text-xs text-slate-600">Final match analytics across the completed tournament.</div>
              </GlassCard>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-6 text-sm text-(--muted)">
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