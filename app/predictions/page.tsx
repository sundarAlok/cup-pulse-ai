import PredictionCard from "@/components/PredictionCard";
import DemoPredictionControls from "@/components/DemoPredictionControls";
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

  const demoMatch: Match = {
    id: 999999,
    homeTeam: "Team A",
    awayTeam: "Team X",
    date: "2026-07-30T18:00:00Z",
    status: "SCHEDULED",
  };

  let predictionMatches = matches.filter(
    (match) =>
      match.status === "SCHEDULED" ||
      match.status === "TIMED"
  );

  predictionMatches = [
    demoMatch,
    ...predictionMatches,
  ];

  return (
    <div className="space-y-8 px-28 py-24">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          AI Prediction Agent
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Match Predictions
        </h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Predict upcoming matches, compare against AI,
          earn points and unlock Injective rewards.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Matches
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {predictionMatches.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Prediction Cost
          </p>

          <h3 className="mt-2 text-3xl font-bold text-orange-500">
            -1
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Per prediction
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            AI Prediction Cost
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-500">
            -7
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Per AI prediction
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Correct Prediction
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            +50
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Reward points
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            AI Accuracy
          </p>

          <h3 className="mt-2 text-3xl font-bold text-violet-600">
            82%
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Historical average
          </p>
        </div>
      </section>

      {/* Match Predictions */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Predict Match Winners
          </h2>

          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
            -1 point per prediction
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {predictionMatches.map((match) => (
            <div
              key={match.id}
              className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Open Prediction
                  </span>

                  {match.id === 999999 && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                      Demo Match
                    </span>
                  )}
                </div>
              </div>

              {/* Teams */}
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {match.homeTeam}
                  </h3>

                  <p className="my-3 font-medium text-slate-400">
                    VS
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {match.awayTeam}
                  </h3>
                </div>

                <p className="mt-4 text-center text-sm text-slate-500">
                  {new Date(match.date).toLocaleString()}
                </p>

                {match.id === 999999 ? (
                  <DemoPredictionControls
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                  />
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
                      Predict {match.homeTeam}
                    </button>

                    <button className="rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50">
                      Predict {match.awayTeam}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Predictions */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          My Predictions
        </h2>

        <p className="mt-3 text-slate-500">
          Submitted predictions will appear here.
          Correct predictions earn +50 points.
        </p>

        <div className="mt-6">
          <DemoPredictionControls
            homeTeam={demoMatch.homeTeam}
            awayTeam={demoMatch.awayTeam}
            variant="summary"
          />
        </div>
      </section>

      {/* AI Chat Prediction */}
      <PredictionCard />
    </div>
  );
}