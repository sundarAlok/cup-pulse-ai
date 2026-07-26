import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="px-6 py-24 lg:px-28">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mt-4 text-slate-600 leading-7">
            At CupPulse AI, your privacy matters. We collect only the information necessary to provide your profile, predictions, and reward activity.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            We do not share personal data with third parties except as required to support authentication, analytics, and platform services.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Information we collect</h2>
          <ul className="mt-4 space-y-3 list-disc pl-5 text-slate-600">
            <li>Profile data like username, display name, and email.</li>
            <li>Match predictions and reward history.</li>
            <li>Basic usage metrics to help improve the app experience.</li>
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
