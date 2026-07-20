import Link from "next/link";
import { ArrowRight, Trophy, Brain, Coins, Zap } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import Hero from "../components/Hero";
import GlassCard from "../components/GlassCard";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden pb-24">
      <AnimatedBackground />

      <main className="relative">
        <Hero />

        <div className="max-w-7xl mx-auto w-full px-6 space-y-12">
          {/* Live Match Intelligence */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Live Match Intelligence</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--muted)]">Now</div>
                    <div className="mt-2 text-lg font-bold">Argentina 1 — 0 Netherlands</div>
                    <div className="mt-1 text-xs text-[var(--muted)]">62 • Lusail Iconic</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-[var(--muted)]">AI Prob</div>
                    <div className="mt-2 text-2xl font-extrabold">71%</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Upcoming</div>
                <div className="mt-2 font-bold">France vs Brazil</div>
                <div className="mt-1 text-xs text-[var(--muted)]">Starts in 4h</div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm text-[var(--muted)]">Summary</div>
                <div className="mt-2">Top momentum: Brazil • Highest xG: France</div>
              </GlassCard>
            </div>
          </section>

          {/* Tournament Intelligence Graph (placeholder) */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tournament Intelligence</h2>
            <GlassCard className="h-72 flex items-center justify-center">
              <div className="text-center text-[var(--muted)]">
                <div className="mb-2 font-semibold">Interactive Bracket & Graph (coming soon)</div>
                <div className="text-sm">Tournament Intelligence Graph will be added in Phase 2.</div>
              </div>
            </GlassCard>
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
            <GlassCard className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Tournament Simulator</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Run AI-driven tournament simulations to estimate probabilities and outcomes.</p>
              </div>

              <div className="ml-auto flex gap-3">
                <Link href="/simulator" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary-1)] to-[var(--primary-2)] px-5 py-2 font-semibold text-black">
                  Open Simulator
                  <ArrowRight className="w-4 h-4" />
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