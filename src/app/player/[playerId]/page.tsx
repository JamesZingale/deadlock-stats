import { db } from "../../lib/db";
import { RowDataPacket } from "mysql2/promise";
import PlayerPageClient from "../../components/PlayerPageClient";

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

export default async function PlayerPage({ params }: { params: { playerId: string } }) {
  const playerIdNum = Number(params.playerId);

  const [playerRows] = await db.query<Player & RowDataPacket[]>(
    `SELECT username, total_matches_played, total_wins, total_losses
     FROM players WHERE player_id = ?`,
    [playerIdNum]
  );

  const row = playerRows[0];
  if (!row) return <p>Player not found</p>;

  // Strip RowDataPacket type to plain Player
  const playerInfo: Player = {
    username: row.username,
    total_matches_played: row.total_matches_played,
    total_wins: row.total_wins,
    total_losses: row.total_losses,
  };

  const [matchesRows] = await db.query<(Match & RowDataPacket)[]>(
    `SELECT pm.match_id, pm.hero_id, pm.kills, pm.deaths, pm.assists, pm.damage_done, pm.healing_done,
            m.match_mode, m.winning_team
     FROM playermatchstats pm
     JOIN matches m ON pm.match_id = m.match_id
     WHERE pm.player_id = ?
     ORDER BY m.start_time DESC
     LIMIT 20`,
    [playerIdNum]
  );

  const matches: Match[] = matchesRows.map((m) => ({
    match_id: m.match_id,
    hero_id: m.hero_id,
    kills: m.kills,
    deaths: m.deaths,
    assists: m.assists,
    damage_done: m.damage_done,
    healing_done: m.healing_done,
    match_mode: m.match_mode,
    winning_team: m.winning_team,
  }));

  return <PlayerPageClient playerInfo={playerInfo} matches={matches} playerId={playerIdNum} />;
}
