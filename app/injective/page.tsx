import Link from "next/link";

const technologies = [
  {
    title: "MCP Server",
    status: "Active",
    color: "green",
    description:
      "A structured football data API that powers AI prediction workflows in CupPulse AI.",
    usage:
      "Match schedules, live stats, team data, and tournament context for agents.",
    action: {
      label: "Try MCP endpoint",
      href: "/api/mcp?action=getMatches",
    },
  },
  {
    title: "Agent Skills",
    status: "Active",
    color: "green",
    description:
      "AI capabilities that analyze football data and generate prediction reasoning.",
    usage:
      "Winner prediction, confidence scoring, trend analysis, and matchup signals.",
  },
  {
    title: "x402",
    status: "Demo",
    color: "blue",
    description:
      "Premium insights layer for advanced prediction analysis and restricted access content.",
    usage:
      "Exclusive forecasting features, higher-value analytics, and upgradeable premium tools.",
  },
  {
    title: "CCTP",
    status: "Testnet",
    color: "purple",
    description:
      "Simulated cross-chain reward distribution using Injective-compatible token patterns.",
    usage:
      "Fan rewards redemption, point-to-token flows, and Injective testnet reward concepts.",
  },
];

export default function InjectivePage() {
  return (
    <div className="space-y-10 px-6 py-24 lg:px-28">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-cyan-100 p-10 shadow-sm">
        <div className="absolute right-0 top-0 hidden h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl md:block" />

        <div className="relative max-w-4xl">
          <span className="inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-800">
            Injective Integration Hub
          </span>

          <h1 className="mt-5 text-4xl font-bold text-slate-900 sm:text-5xl">
            Injective and MCP Architecture
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            CupPulse AI combines live football intelligence, AI prediction agents, premium insights and reward simulations with Injective-style testnet concepts and a dedicated MCP backend.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/api/mcp?action=getMatches"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Check the MCP endpoint
            </Link>
            <span className="text-sm text-slate-500">
              Live fetch point for anyone to inspect the MCP server response.
            </span>
          </div>
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

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <pre className="whitespace-pre-wrap text-sm text-slate-700">
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

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">MCP Server Check</h3>
            <p className="mt-3 text-sm text-slate-600">
              Validate the MCP service by opening the endpoint that returns the live football payload used by the prediction and agent layers.
            </p>
            <Link
              href="/api/mcp?action=getMatches"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open MCP Match Endpoint
            </Link>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Injective &amp; CCTP</h3>
            <p className="mt-3 text-sm text-slate-600">
              This project uses Injective concepts to illustrate reward token flow on testnet, with CCTP modeled as the bridge for fan points and reward distribution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}