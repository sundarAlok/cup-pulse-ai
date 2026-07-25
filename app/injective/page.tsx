const technologies = [
  {
    title: "MCP Server",
    status: "Integrated",
    color: "green",
    description:
      "Provides structured football data access for AI analysis.",
    usage:
      "Match schedules, team statistics and tournament data.",
  },
  {
    title: "Agent Skills",
    status: "Integrated",
    color: "green",
    description:
      "Powers CupPulse AI prediction workflows.",
    usage:
      "Winner prediction, confidence scoring and reasoning.",
  },
  {
    title: "x402",
    status: "Demo",
    color: "blue",
    description:
      "Premium prediction access layer.",
    usage:
      "Future premium AI insights and advanced analytics.",
  },
  {
    title: "CCTP",
    status: "Testnet",
    color: "purple",
    description:
      "Cross-chain reward distribution.",
    usage:
      "Fan rewards distributed using Injective ecosystem concepts.",
  },
];

export default function InjectivePage() {
  return (
    <div className="space-y-10 px-28 py-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-10 shadow-sm">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Injective Global Cup Hackathon
          </span>

          <h1 className="mt-5 text-5xl font-bold text-slate-900">
            Injective Integration Hub
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            CupPulse AI combines AI-powered football insights
            with Injective technologies to create a smarter,
            reward-driven fan experience.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            MCP Server
          </p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            Active
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Agent Skills
          </p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            Active
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            x402
          </p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            Demo
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            CCTP
          </p>
          <h3 className="mt-2 text-3xl font-bold text-purple-600">
            Testnet
          </h3>
        </div>
      </section>

      {/* Technologies */}
      <section>
        <h2 className="mb-6 text-3xl font-bold text-slate-900">
          Technology Mapping
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {technologies.map((tech) => (
            <div
              key={tech.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">
                  {tech.title}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tech.color === "green"
                      ? "bg-green-100 text-green-700"
                      : tech.color === "purple"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {tech.status}
                </span>
              </div>

              <p className="mt-4 text-slate-600">
                {tech.description}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Usage in CupPulse AI
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {tech.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hackathon Value */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900">
          Why Injective?
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">
              AI-Powered Insights
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Agent Skills help generate intelligent
              football predictions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Fan Incentives
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Reward fans through blockchain-based
              participation systems.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Future Monetization
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              x402 enables premium football analytics
              and advanced predictions.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">
          CupPulse AI Architecture
        </h2>

        <div className="overflow-x-auto">
          <pre className="text-slate-700 text-sm">
{`User
 │
 ▼
CupPulse AI
 │
 ├── Football Data
 │
 ├── AI Prediction Agent
 │       │
 │       └── Agent Skills
 │
 ├── Premium Insights
 │       │
 │       └── x402
 │
 └── Rewards System
         │
         └── CCTP`}
          </pre>
        </div>
      </section>
    </div>
  );
}