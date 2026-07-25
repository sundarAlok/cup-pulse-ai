import db from "@/lib/db";

type User = {
  id: number;
  username: string;
  points: number;
};

export default function LeaderboardPage() {
  const users = db
    .prepare(
      `
      SELECT id, username, points
      FROM users
      ORDER BY points DESC
      LIMIT 100
    `
    )
    .all() as User[];

  return (
    <div className="space-y-8 px-28 py-24">
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white">
        <p className="text-sm opacity-80">
          Community Rankings
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Fan Leaderboard
        </h1>

        <p className="mt-4 text-blue-100">
          Top World Cup fans ranked by earned points.
        </p>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-right">Points</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-slate-100"
              >
                <td className="p-4 font-bold">
                  #{index + 1}
                </td>

                <td className="p-4 font-medium">
                  {user.username}
                </td>

                <td className="p-4 text-right font-bold text-blue-600">
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}