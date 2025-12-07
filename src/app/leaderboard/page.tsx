import { db } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [players] = await db.query(
    `SELECT 
        player_id,
        username,
        total_matches_played,
        total_wins,
        total_losses,
        (total_wins / NULLIF(total_matches_played, 0)) AS winrate
     FROM players
     WHERE total_matches_played > 0
     ORDER BY winrate DESC, total_matches_played DESC`
  ) as any;

  return (
    <div className="w-full min-h-screen px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>

      <div className="border rounded-lg overflow-hidden shadow-md bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-3 font-semibold">Rank</th>
              <th className="text-left p-3 font-semibold">Player</th>
              <th className="text-left p-3 font-semibold">Winrate</th>
              <th className="text-left p-3 font-semibold">Wins</th>
              <th className="text-left p-3 font-semibold">Losses</th>
              <th className="text-left p-3 font-semibold">Matches</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p: any, index: number) => (
              <tr key={p.player_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{p.username || "Unknown"}</td>
                <td className="p-3">
                  {(p.winrate * 100).toFixed(1)}%
                </td>
                <td className="p-3">{p.total_wins}</td>
                <td className="p-3">{p.total_losses}</td>
                <td className="p-3">{p.total_matches_played}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}