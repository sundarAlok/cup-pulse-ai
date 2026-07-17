import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center">
        <span className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium">
          Injective Global Cup Hackathon
        </span>

        <h1 className="mt-8 text-6xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            CupPulse AI
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-600">
          Real-time World Cup insights, AI-powered match predictions,
          fan engagement rewards, and Injective-powered blockchain
          experiences in one platform.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Open Dashboard
          </Link>

          <Link
            href="/predictions"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Try AI Predictions
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-lg">
            Live Matches
          </h3>

          <p className="mt-2 text-slate-500 text-sm">
            Track upcoming World Cup fixtures and match data.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-lg">
            AI Predictions
          </h3>

          <p className="mt-2 text-slate-500 text-sm">
            Get winner predictions, confidence scores, and reasoning.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-lg">
            Fan Rewards
          </h3>

          <p className="mt-2 text-slate-500 text-sm">
            Earn points for participation and prediction accuracy.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-lg">
            Injective
          </h3>

          <p className="mt-2 text-slate-500 text-sm">
            MCP, Agent Skills, x402, and CCTP integrations.
          </p>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900">
          How It Works
        </h2>

        <div className="grid gap-6 md:grid-cols-4 mt-8">
          <div>
            <h3 className="font-semibold">1. View Matches</h3>
            <p className="mt-2 text-slate-500 text-sm">
              Browse World Cup fixtures and team information.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">2. Ask AI</h3>
            <p className="mt-2 text-slate-500 text-sm">
              Request predictions for upcoming matches.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">3. Earn Points</h3>
            <p className="mt-2 text-slate-500 text-sm">
              Participate daily and submit predictions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">4. Claim Rewards</h3>
            <p className="mt-2 text-slate-500 text-sm">
              Redeem rewards through the Injective reward flow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}