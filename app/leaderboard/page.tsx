import { getLeaderboardRows } from "@/lib/firebaseStore";
import UserAvatar from "@/components/UserAvatar";

type User = {
  id: string;
  username: string;
  displayName?: string | null;
  points: number;
  photoURL?: string | null;
};

export default async function LeaderboardPage() {
  const users = (await getLeaderboardRows(100)) as User[];

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
              <th className="p-4 text-left">Photo</th>
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
                <td className="p-4">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    <UserAvatar
                      src={user.photoURL}
                      alt={user.username || user.displayName || "User"}
                      className="h-full w-full object-cover"
                      fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-500"
                      fallbackText={user.username || user.displayName || "U"}
                    />
                  </div>
                </td>

                <td className="p-4 font-bold">
                  #{index + 1}
                </td>

                <td className="p-4 font-medium">
                  {user.username || user.displayName || "Unknown"}
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