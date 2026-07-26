import MatchCard from "@/components/MatchCard";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { getMatches } from "@/lib/football";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
};

export default async function DashboardPage() {
  let matches: Match[] = [];

  try {
    matches = await getMatches();
  } catch (error) {
    console.error(
      "Failed to load matches:",
      error
    );
  }

  const demoMatch: Match = {
    id: 999999,
    homeTeam: "Team A",
    awayTeam: "Team X",
    date: "2026-08-15T18:00:00Z",
    status: "SCHEDULED",
    homeScore: null,
    awayScore: null,
  };

  const liveMatches = matches.filter(
    (match) =>
      match.status === "LIVE" ||
      match.status === "IN_PLAY" ||
      match.status === "PAUSED"
  );

  const upcomingMatches = [
    demoMatch,
    ...matches.filter(
      (match) =>
        match.status === "SCHEDULED" ||
        match.status === "TIMED"
    ),
  ];

  const finishedMatches = matches.filter(
    (match) =>
      match.status === "FINISHED"
  );

  return (
    <div className="space-y-10 px-28 py-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-blue-600">
            FIFA World Cup Companion
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            World Cup Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Live scores, upcoming fixtures,
            completed matches, AI predictions
            and fan rewards.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Live Matches
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-500">
            {liveMatches.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Upcoming
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {upcomingMatches.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Finished
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {finishedMatches.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Matches
          </p>

          <h3 className="mt-2 text-3xl font-bold text-violet-600">
            {matches.length + 1}
          </h3>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

            <h2 className="text-2xl font-bold text-slate-900">
              Live Matches
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Upcoming Matches
          </h2>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Includes Interactive Demo Match
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingMatches.map((match) => (
            <UpcomingMatchCard
              key={match.id}
              match={match}
            />
          ))}
        </div>
      </section>

      {/* Finished */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Finished Matches
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {finishedMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
            />
          ))}
        </div>
      </section>
    </div>
  );
}