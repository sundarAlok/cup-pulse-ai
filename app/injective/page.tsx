export default function InjectivePage() {
  const technologies = [
    {
      title: "MCP Server",
      description:
        "Provides football data access for AI-powered insights.",
    },
    {
      title: "Agent Skills",
      description:
        "Drives the CupPulse Prediction Agent.",
    },
    {
      title: "x402",
      description:
        "Premium prediction endpoint simulation.",
    },
    {
      title: "CCTP",
      description:
        "Cross-chain reward payout simulation.",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Injective Integration
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {technologies.map((tech) => (
          <div
            key={tech.title}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-semibold mb-3">
              {tech.title}
            </h2>

            <p className="text-zinc-400">
              {tech.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}