const technologies = [
  {
    title: "MCP Server",
    status: "Integrated",
    description:
      "Used by CupPulse AI to access football match data and provide AI-powered insights.",
    usage:
      "Fetches match schedules, team information, and statistics for prediction analysis.",
  },
  {
    title: "Agent Skills",
    status: "Integrated",
    description:
      "Powers the AI Prediction Agent that analyzes match information.",
    usage:
      "Generates winner predictions, confidence scores, and reasoning.",
  },
  {
    title: "x402",
    status: "Demo",
    description:
      "Premium prediction access mechanism for advanced fan insights.",
    usage:
      "Simulated premium AI prediction endpoint for future monetization.",
  },
  {
    title: "CCTP",
    status: "Demo",
    description:
      "Cross-chain reward distribution mechanism.",
    usage:
      "Simulates USDC reward claims for active fans.",
  },
];

export default function InjectivePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          Injective Ecosystem
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Injective Integration
        </h1>

        <p className="mt-4 max-w-3xl text-slate-500">
          CupPulse AI demonstrates how Injective technologies can
          enhance World Cup fan experiences through AI-powered
          predictions, premium insights, and blockchain reward systems.
        </p>
      </section>

      {/* Overview */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">MCP</p>
          <h3 className="mt-2 text-2xl font-bold">Active</h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Agent Skills</p>
          <h3 className="mt-2 text-2xl font-bold">Active</h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">x402</p>
          <h3 className="mt-2 text-2xl font-bold">Demo</h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">CCTP</p>
          <h3 className="mt-2 text-2xl font-bold">Demo</h3>
        </div>
      </section>

      {/* Technology Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Technology Usage
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {technologies.map((tech) => (
            <div
              key={tech.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {tech.title}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tech.status === "Integrated"
                      ? "bg-green-100 text-green-700"
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
                <p className="text-sm font-medium text-slate-700">
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

      {/* Architecture */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          Integration Flow
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