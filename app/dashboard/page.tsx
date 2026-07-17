import MatchCard from "@/components/MatchCard";
import { getMatches } from "@/lib/football";

export default async function DashboardPage() {
  let matches: any[] = [];

  try {
    matches = await getMatches();
  } catch (error) {
    console.error("Failed to load matches:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              FIFA World Cup Companion
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              World Cup Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              Track upcoming matches, team performance, live updates,
              and AI-powered predictions in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4">
            <p className="text-sm text-slate-500">
              Matches Available
            </p>

            <p className="text-3xl font-bold text-blue-600">
              {matches.length}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Matches
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {matches.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            AI Predictions
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            Ready
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Fan Rewards
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            Active
          </h3>
        </div>
      </section>

      {/* Matches */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Upcoming Matches
          </h2>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              No Match Data Available
            </h3>

            <p className="mt-2 text-slate-500">
              Check your Football Data API key and try again.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}