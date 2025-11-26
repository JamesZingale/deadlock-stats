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

  if (!player) return <p>Player not found</p>;

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

  const boxStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '16px',
    margin: '10px 0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div>
      <h1>Username: {player.username}</h1>
      <div className="border border-gray-300 dark:border-gray-700 p-4 rounded bg-white dark:bg-neutral-900 shadow">
        <p><strong>Total Matches:</strong> {player.total_matches_played}</p>
        <p><strong>Total Wins:</strong> {player.total_wins}</p>
        <p><strong>Total Losses:</strong> {player.total_losses}</p>
      </div>

      <h2>Recent Matches</h2>
      {matchesRows.map((match) => (
        <div key={match.match_id} className="border border-gray-300 dark:border-gray-700 p-4 mb-4 rounded bg-white dark:bg-neutral-900 shadow">
          <p><strong>Match ID:</strong> {match.match_id}</p>
          <p><strong>Hero Played:</strong> {match.hero_name}</p>
          <p><strong>K/D/A:</strong> {match.kills}/{match.deaths}/{match.assists}</p>
          <p><strong>Damage Done:</strong> {match.damage_done}</p>
          <p><strong>Healing Done:</strong> {match.healing_done}</p>
          <p><strong>Match Mode:</strong> {match.match_mode}</p>
          <p><strong>Winning Team:</strong> {match.winning_team}</p>
        </div>
      ))}
    </div>
  );
}