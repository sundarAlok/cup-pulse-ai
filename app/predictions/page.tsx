import PredictionCard from "@/components/PredictionCard";

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          AI Prediction Agent
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Match Predictions
        </h1>

        <p className="mt-4 max-w-3xl text-slate-500">
          Ask CupPulse AI about any World Cup match and receive a
          prediction, confidence score, and reasoning based on team
          performance and available match information.
        </p>
      </section>

      {/* Features */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Prediction Engine
          </p>

          <h3 className="mt-2 text-xl font-bold">
            AI Powered
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Confidence Score
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Included
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Reasoning
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Generated
          </h3>
        </div>
      </section>

      {/* Prediction Tool */}
      <PredictionCard />

      {/* Example Questions */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Example Questions
        </h2>

        <div className="grid gap-3">
          <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
            Who is likely to win Argentina vs Brazil?
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
            Predict the outcome of France vs Germany.
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
            Which team has a stronger chance of advancing?
          </div>
        </div>
      </section>
    </div>
  );
}