import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="px-6 py-24 lg:px-28">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
          <p className="mt-4 text-slate-600 leading-7">
            These Terms of Service explain how you may use CupPulse AI, what behavior is allowed, and how we handle your participation in predictions and rewards.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            By using CupPulse AI, you agree to our rules for creating an account, submitting predictions, and interacting with the platform.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Key terms</h2>
          <ul className="mt-4 space-y-3 list-disc pl-5 text-slate-600">
            <li>Accounts are for individual use and must not be shared.</li>
            <li>Predictions should be entered in good faith and only once per match.</li>
            <li>Rewards are subject to the app’s current point conversion and availability.</li>
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
            href="/about"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
