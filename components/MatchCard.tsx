type MatchCardProps = {
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
    status: string;
  };
};

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-cyan-500 transition">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
          {match.status}
        </span>
      </div>

      <h2 className="text-xl font-semibold">
        {match.homeTeam}
      </h2>

      <p className="text-zinc-500 my-2 text-center">VS</p>

      <h2 className="text-xl font-semibold">
        {match.awayTeam}
      </h2>

      <p className="text-zinc-400 mt-4">
        {new Date(match.date).toLocaleString()}
      </p>
    </div>
  );
}