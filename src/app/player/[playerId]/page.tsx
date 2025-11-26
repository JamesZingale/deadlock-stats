// app/player/[id]/page.tsx
import { db } from '../../lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface Player {
  username: string;
  total_matches_played: number;
  total_wins: number;
  total_losses: number;
}

interface Match {
  match_id: number;
  hero_name: string;
  kills: number;
  deaths: number;
  assists: number;
  damage_done: number;
  healing_done: number;
  match_mode: string;
  winning_team: string;
}

interface PlayerPageProps {
  params: { playerId: string };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const playerId = Number(params.playerId);

  const [playerRows] = await db.query<Player & RowDataPacket[]>(
    `SELECT username, total_matches_played, total_wins, total_losses
     FROM Players
     WHERE player_id = ?`,
    [playerId]
  );
  const player = playerRows[0];

  if (!player) return <p className="text-center mt-10">Player not found</p>;

  const [matchesRows] = await db.query<Match & RowDataPacket[]>(
    `SELECT pm.match_id, pm.hero_id, h.hero_name, pm.kills, pm.deaths, pm.assists, pm.damage_done, pm.healing_done,
            m.match_mode, m.winning_team
     FROM PlayerMatchStats pm
     JOIN Matches m ON pm.match_id = m.match_id
     JOIN Heroes h ON pm.hero_id = h.hero_id
     WHERE pm.player_id = ?
     ORDER BY m.start_time DESC
     LIMIT 20`,
    [playerId]
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{player.username}</h1>

      {/* Player stats dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded shadow p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Matches</p>
          <p className="text-2xl font-bold">{player.total_matches_played}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded shadow p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Wins</p>
          <p className="text-2xl font-bold">{player.total_wins}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded shadow p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Losses</p>
          <p className="text-2xl font-bold">{player.total_losses}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Matches</h2>

      {/* Recent matches cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchesRows.map((match) => (
          <div
            key={match.match_id}
            className="bg-white dark:bg-neutral-900 rounded shadow p-4 flex flex-col space-y-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between">
              <span className="font-semibold">Match #{match.match_id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{match.match_mode}</span>
            </div>
            <div className="flex justify-between">
              <span>Hero: {match.hero_name}</span>
              <span>Winner: {match.winning_team}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>K/D/A: {match.kills}/{match.deaths}/{match.assists}</span>
              <span>Damage: {match.damage_done}</span>
              <span>Healing: {match.healing_done}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
