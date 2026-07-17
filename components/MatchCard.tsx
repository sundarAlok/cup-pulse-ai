import Image from "next/image";
type MatchCardProps = {
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
    status: string;
    homeScore?: number | null;
    awayScore?: number | null;
  };
};

const flagMap: Record<string, string> = {
  Argentina: "ar",
  Brazil: "br",
  France: "fr",
  Germany: "de",
England: "gb",
  Spain: "es",
  Portugal: "pt",
  Mexico: "mx",
  USA: "us",
  Canada: "ca",
  Japan: "jp",
  Australia: "au",
  Morocco: "ma",
  Croatia: "hr",
  Netherlands: "nl",
  Belgium: "be",
  Uruguay: "uy",
  Serbia: "rs",
  Poland: "pl",
  Denmark: "dk",
  Switzerland: "ch",
  "South Korea": "kr",
  "Saudi Arabia": "sa",
  Qatar: "qa",
  Ecuador: "ec",
  Cameroon: "cm",
  Ghana: "gh",
  Senegal: "sn",
  Tunisia: "tn",
  "South Africa": "za",
};

export default function MatchCard({
  match,
}: MatchCardProps) {
  const matchDate = new Date(match.date);

  const homeFlag =
    flagMap[match.homeTeam] || "un";

  const awayFlag =
    flagMap[match.awayTeam] || "un";

  const isLive =
    match.status === "LIVE" ||
    match.status === "IN_PLAY";

  const isFinished =
    match.status === "FINISHED";

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isLive
              ? "bg-red-100 text-red-600"
              : isFinished
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isLive ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              LIVE
            </span>
          ) : (
            match.status
          )}
        </span>

        <span className="text-xs text-slate-400">
          #{match.id}
        </span>
      </div>

      {/* Teams */}
      <div className="my-8 flex items-center justify-between">
        {/* Home */}
        <div className="flex flex-1 flex-col items-center">
          <Image
            src={`https://flagcdn.com/w80/${homeFlag}.png`}
            alt={match.homeTeam}
            width={64}
            height={64}
            className="mb-3 h-16 w-16 rounded-full object-cover shadow"
          />

          <h3 className="text-center text-lg font-bold text-slate-900">
            {match.homeTeam}
          </h3>

          {isLive || isFinished ? (
            <p className="mt-2 text-3xl font-black text-blue-600">
              {match.homeScore ?? 0}
            </p>
          ) : null}
        </div>

        {/* Center */}
        <div className="mx-4 flex flex-col items-center">
          {isLive || isFinished ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Score
              </p>

              <div className="mt-2 text-3xl font-black text-slate-900">
                {(match.homeScore ?? 0)} -{" "}
                {(match.awayScore ?? 0)}
              </div>
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 font-bold text-white shadow-lg">
              VS
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-1 flex-col items-center">
          <Image
            src={`https://flagcdn.com/w80/${awayFlag}.png`}
            alt={match.awayTeam}
            width={64}
            height={64}
            className="mb-3 h-16 w-16 rounded-full object-cover shadow"
          />

          <h3 className="text-center text-lg font-bold text-slate-900">
            {match.awayTeam}
          </h3>

          {isLive || isFinished ? (
            <p className="mt-2 text-3xl font-black text-blue-600">
              {match.awayScore ?? 0}
            </p>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-4">
        <p className="font-medium text-slate-700">
          {matchDate.toLocaleDateString()}
        </p>

        <p className="text-sm text-slate-500">
          {matchDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}