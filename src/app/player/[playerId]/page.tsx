// app/player/[id]/page.tsx
import { db } from '../../lib/db';
import { RowDataPacket } from 'mysql2/promise';
import PlayerPageClient from '../../components/PlayerPageClient';

interface Player {
  username: string;
  total_matches_played: number;
  total_wins: number;
  total_losses: number;
}

interface Match {
  match_id: number;
  hero_id: number;
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

  // Fetch player info
  const [playerRows] = await db.query<Player & RowDataPacket[]>(
    `SELECT username, total_matches_played, total_wins, total_losses
     FROM Players
     WHERE player_id = ?`,
    [playerId]
  );

  const row = playerRows[0];
  if (!row) return <p className="text-center mt-10">Player not found</p>;

  const playerInfo: Player = {
    username: row.username,
    total_matches_played: row.total_matches_played,
    total_wins: row.total_wins,
    total_losses: row.total_losses,
  };

  // Fetch recent matches
  const [matchesRows] = await db.query<Match & RowDataPacket[]>(
    `SELECT pm.match_id, pm.hero_id, h.hero_name, pm.kills, pm.deaths, pm.assists,
            pm.damage_done, pm.healing_done, m.match_mode, m.winning_team
     FROM PlayerMatchStats pm
     JOIN Matches m ON pm.match_id = m.match_id
     JOIN Heroes h ON pm.hero_id = h.hero_id
     WHERE pm.player_id = ?
     ORDER BY m.start_time DESC
     LIMIT 20`,
    [playerId]
  );

  const matches: Match[] = matchesRows.map((m) => ({
    match_id: m.match_id,
    hero_id: m.hero_id,
    hero_name: m.hero_name,
    kills: m.kills,
    deaths: m.deaths,
    assists: m.assists,
    damage_done: m.damage_done,
    healing_done: m.healing_done,
    match_mode: m.match_mode,
    winning_team: m.winning_team,
  }));

  return <PlayerPageClient playerInfo={playerInfo} matches={matches} playerId={playerId} />;
}
