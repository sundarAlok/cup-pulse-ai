type MatchCardProps = {
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
    status: string;
  };
};

export default function MatchCard({
  match,
}: MatchCardProps) {
  const matchDate = new Date(match.date);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            match.status === "FINISHED"
              ? "bg-green-100 text-green-700"
              : match.status === "LIVE"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {match.status}
        </span>

        <span className="text-xs text-slate-500">
          Match #{match.id}
        </span>
      </div>

      <div className="py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              {match.homeTeam}
            </h3>
          </div>

          <div className="px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
              VS
            </div>
          </div>

          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              {match.awayTeam}
            </h3>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          {matchDate.toLocaleDateString()}
        </p>

        <p className="text-sm text-slate-400">
          {matchDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}