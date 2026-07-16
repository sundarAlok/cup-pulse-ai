import MatchCard from "@/components/MatchCard";

export default async function DashboardPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        World Cup Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.matches?.map((match: any) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}