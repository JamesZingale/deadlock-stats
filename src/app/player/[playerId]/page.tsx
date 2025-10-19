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
  hero_id: number;
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
    `SELECT pm.match_id, pm.hero_id, pm.kills, pm.deaths, pm.assists, pm.damage_done, pm.healing_done,
            m.match_mode, m.winning_team
     FROM PlayerMatchStats pm
     JOIN Matches m ON pm.match_id = m.match_id
     WHERE pm.player_id = ?
     ORDER BY m.start_time DESC
     LIMIT 20`,
    [playerId]
  );

  return (
    <div>
      <h1>{player.username}</h1>
      <p>Total Matches: {player.total_matches_played}</p>
      <p>Total Wins: {player.total_wins}</p>
      <p>Total Losses: {player.total_losses}</p>
      <h2>Recent Matches</h2>
      <ul>
        {matchesRows.map((match) => (
          <li key={match.match_id}>
            Match {match.match_id}: K/D/A {match.kills}/{match.deaths}/{match.assists}, Damage {match.damage_done}, Healing {match.healing_done}
          </li>
        ))}
      </ul>
    </div>
  );
}