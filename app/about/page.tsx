import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="px-6 py-24 lg:px-28">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">About CupPulse AI</h1>
          <p className="mt-4 text-slate-600 leading-7">
            CupPulse AI is a World Cup fan engagement platform built to help supporters track live match insights, submit predictions, and earn rewards for participation.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            Our mission is to make football prediction and rewards accessible with real-time data, in-app analytics, and web3-inspired incentive mechanics.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
          <ul className="mt-4 space-y-3 list-disc pl-5 text-slate-600">
            <li>Track upcoming matches and live score updates.</li>
            <li>Submit predictions and earn points for correct outcomes.</li>
            <li>Claim rewards and connect to Injective Testnet for premium unlocks.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Home
          </Link>
          <Link
            href="/privacy"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
