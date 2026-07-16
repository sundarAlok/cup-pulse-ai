import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <span className="px-4 py-1 rounded-full border border-cyan-500 text-cyan-400 text-sm">
        Injective Global Cup Hackathon
      </span>

      <h1 className="text-6xl font-bold mt-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        CupPulse AI
      </h1>

      <p className="text-zinc-400 mt-6 max-w-2xl">
        Real-time World Cup insights, AI-powered predictions, and fan rewards
        powered by Injective.
      </p>

      <div className="flex gap-4 mt-10">
        <Link
          href="/dashboard"
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Open Dashboard
        </Link>

        <Link
          href="/predictions"
          className="border border-zinc-700 px-6 py-3 rounded-xl"
        >
          AI Predictions
        </Link>
      </div>
    </div>
  );
}