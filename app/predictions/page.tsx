import PredictionCard from "@/components/PredictionCard";
import { getMatches } from "@/lib/football";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
};

export default async function PredictionsPage() {
  const matches: Match[] = await getMatches();

  let predictionMatches = matches.filter(
    (match) =>
      match.status === "SCHEDULED" ||
      match.status === "TIMED"
  );

  if (predictionMatches.length === 0) {
    predictionMatches = matches.filter(
      (match) =>
        match.status === "LIVE" ||
        match.status === "IN_PLAY"
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          AI Prediction Agent
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Match Predictions
        </h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Predict upcoming World Cup matches, earn fan
          points, unlock rewards, and compare your picks
          against CupPulse AI.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Matches Open
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {predictionMatches.length}
          </h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Submission Reward
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            +5
          </h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Correct Prediction
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            +50
          </h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Wrong Prediction
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-500">
            -20
          </h3>
        </div>
      </section>

      {/* Match Predictions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Predict Match Winners
          </h2>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            +5 Points Per Prediction
          </span>
        </div>

        {predictionMatches.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              No Open Matches Available
            </h3>

            <p className="mt-2 text-slate-500">
              New matches will appear automatically
              when available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {predictionMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Open
                  </span>

                  <span className="text-xs text-slate-500">
                    +5 Points
                  </span>
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {match.homeTeam}
                  </h3>

                  <p className="my-3 text-slate-400 font-medium">
                    VS
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {match.awayTeam}
                  </h3>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500">
                  {new Date(
                    match.date
                  ).toLocaleString()}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="rounded-xl bg-blue-600 py-3 text-white font-medium hover:bg-blue-700">
                    {match.homeTeam}
                  </button>

                  <button className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50">
                    {match.awayTeam}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Predictions */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          My Predictions
        </h2>

        <p className="mt-3 text-slate-500">
          Your submitted predictions will appear
          here. Predictions become locked at match
          day 00:00 and rewards are distributed
          automatically after results are finalized.
        </p>
      </section>

      {/* AI Agent */}
      <PredictionCard />
    </div>
  );
}