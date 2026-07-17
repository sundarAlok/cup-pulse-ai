import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Trophy,
  Coins,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200 blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-40 -right-40 h-96 w-96 rounded-full bg-violet-200 blur-3xl opacity-40 animate-pulse" />

      <div className="relative space-y-20">
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          <div className="rounded-full border border-blue-200 bg-white/80 backdrop-blur px-5 py-2 text-sm font-medium text-blue-600 shadow-sm">
            ⚽ Injective Global Cup Hackathon
          </div>

          <h1 className="mt-8 text-7xl md:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              CupPulse AI
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-600">
            Real-time World Cup insights, AI-powered match
            predictions, fan rewards, and Injective blockchain
            experiences in one modern platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/predictions"
              className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 shadow-sm transition hover:scale-105 hover:bg-slate-50"
            >
              AI Predictions
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-6 shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">
                AI
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Match Predictions
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-6 shadow-md">
              <h3 className="text-3xl font-bold text-green-600">
                Live
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                World Cup Matches
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-6 shadow-md">
              <h3 className="text-3xl font-bold text-violet-600">
                USDT
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Fan Rewards
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-6 shadow-md">
              <h3 className="text-3xl font-bold text-cyan-600">
                Web3
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Injective Powered
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900">
              Platform Features
            </h2>

            <p className="mt-3 text-slate-500">
              Everything fans need during the World Cup.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="group rounded-3xl bg-white border border-slate-200 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <Trophy className="h-10 w-10 text-blue-600" />

              <h3 className="mt-5 text-xl font-bold">
                Live Matches
              </h3>

              <p className="mt-3 text-slate-500">
                Track live scores, upcoming fixtures, and completed matches.
              </p>
            </div>

            <div className="group rounded-3xl bg-white border border-slate-200 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <Brain className="h-10 w-10 text-violet-600" />

              <h3 className="mt-5 text-xl font-bold">
                AI Predictions
              </h3>

              <p className="mt-3 text-slate-500">
                Get winner predictions, confidence scores, and reasoning.
              </p>
            </div>

            <div className="group rounded-3xl bg-white border border-slate-200 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <Coins className="h-10 w-10 text-green-600" />

              <h3 className="mt-5 text-xl font-bold">
                Fan Rewards
              </h3>

              <p className="mt-3 text-slate-500">
                Earn points from participation and accurate predictions.
              </p>
            </div>

            <div className="group rounded-3xl bg-white border border-slate-200 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <Zap className="h-10 w-10 text-cyan-600" />

              <h3 className="mt-5 text-xl font-bold">
                Injective Tech
              </h3>

              <p className="mt-3 text-slate-500">
                MCP, Agent Skills, x402 and CCTP integrations.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              How CupPulse AI Works
            </h2>

            <p className="mt-3 text-slate-500">
              Simple, engaging, and rewarding.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              "Browse Matches",
              "Make Predictions",
              "Earn Fan Points",
              "Claim Rewards",
            ].map((step, index) => (
              <div
                key={step}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-lg font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 font-bold">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}