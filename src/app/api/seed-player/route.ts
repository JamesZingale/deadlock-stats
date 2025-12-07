// app/api/seed-player/route.ts
import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let accountId = searchParams.get('account_id');

    // Step 0: If no account_id, fetch one active player
    if (!accountId) {
      const activeMatchesRes = await fetch(`${DEADLOCK_API_BASE}/matches/active`);
      if (!activeMatchesRes.ok) throw new Error('Failed to fetch active matches');
      const activeMatches = await activeMatchesRes.json();

      const playerIds: number[] = [];
      for (const match of activeMatches) {
        if (match.players) {
          for (const p of match.players) {
            if (p.account_id) playerIds.push(p.account_id);
          }
        }
        if (playerIds.length > 0) break; // just need one active player
      }

      if (playerIds.length === 0) throw new Error('No active player found');
      const randomIndex = Math.floor(Math.random() * playerIds.length);
      accountId = playerIds[randomIndex].toString();
    }

    // Step 1: Fetch recent matches for this player
    const matchesQuery = encodeURIComponent(`
      SELECT DISTINCT match_id
      FROM match_player
      WHERE account_id = ${accountId}
      ORDER BY match_id DESC
      LIMIT 2
    `);
    const matchesRes = await fetch(`${DEADLOCK_API_BASE}/sql?query=${matchesQuery}`);
    if (!matchesRes.ok) throw new Error('Failed to fetch match IDs');
    const matchesJson = await matchesRes.json();
    const matchIds: number[] = Array.isArray(matchesJson.rows)
      ? matchesJson.rows.map((r: any) => r.match_id)
      : matchesJson.map((r: any) => r.match_id);

    if (matchIds.length === 0) throw new Error('No matches found');

    // Step 2: Fetch all player stats for these matches
    const statsQuery = encodeURIComponent(`
      SELECT match_id, account_id, hero_id, net_worth, kills, deaths, assists,
             stats.player_damage, stats.player_healing, won, team
      FROM match_player
      WHERE match_id IN (${matchIds.join(',')})
    `);
    const statsRes = await fetch(`${DEADLOCK_API_BASE}/sql?query=${statsQuery}`);
    if (!statsRes.ok) throw new Error('Failed to fetch player stats');
    const statsArr = await statsRes.json();
    if (!Array.isArray(statsArr) || statsArr.length === 0) {
      throw new Error('No player stats found for these matches');
    }

    // Step 3: Upsert all matches into Matches table
    const matchInfoQuery = encodeURIComponent(`
      SELECT match_id, start_time, duration_s, match_outcome, match_mode, winning_team
      FROM match_info
      WHERE match_id IN (${matchIds.join(',')})
    `);
    const matchInfoRes = await fetch(`${DEADLOCK_API_BASE}/sql?query=${matchInfoQuery}`);
    const matchInfoArr = await matchInfoRes.json();

    for (const match of matchInfoArr) {
      await db.query(
        `INSERT INTO Matches (match_id, start_time, duration_s, match_outcome, match_mode, winning_team)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           start_time=VALUES(start_time),
           duration_s=VALUES(duration_s),
           match_outcome=VALUES(match_outcome),
           match_mode=VALUES(match_mode),
           winning_team=VALUES(winning_team)`,
        [match.match_id, match.start_time, match.duration_s, match.match_outcome, match.match_mode, match.winning_team]
      );
    }

    // Step 4: Fetch all players’ hero stats and Steam profiles
    const uniquePlayerIds = Array.from(new Set(statsArr.map((p: any) => p.account_id)));
    const heroStatsRes = await fetch(`${DEADLOCK_API_BASE}/players/hero-stats?account_ids=${uniquePlayerIds.join(',')}`);
    const heroStatsArr = heroStatsRes.ok ? await heroStatsRes.json() : [];

    const steamRes = await fetch(`${DEADLOCK_API_BASE}/players/steam?account_ids=${uniquePlayerIds.join(',')}`);
    const steamProfiles = steamRes.ok ? await steamRes.json() : [];
    const usernameMap: Record<number, string> = {};
    for (const profile of steamProfiles) {
      usernameMap[profile.account_id] = profile.personaname || `Player${profile.account_id}`;
    }

        // Step 5: Upsert all players into Players table
    for (const playerId of uniquePlayerIds) {
      const stats = heroStatsArr.filter((h: any) => h.account_id === playerId);
      const totalMatches = stats.reduce((acc: number, h: any) => acc + (h.matches_played || 0), 0);
      const totalWins = stats.reduce((acc: number, h: any) => acc + (h.wins || 0), 0);
      const totalLosses = totalMatches - totalWins;
      const username = usernameMap[playerId] || `Player${playerId}`;

      await db.query(
        `INSERT INTO Players (player_id, username, total_matches_played, total_wins, total_losses)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = IF(Players.username IS NULL OR Players.username = '', VALUES(username), Players.username),
          total_matches_played = VALUES(total_matches_played),
          total_wins = VALUES(total_wins),
          total_losses = VALUES(total_losses)`,
        [playerId, username, totalMatches, totalWins, totalLosses]
      );
    }

    // Step 6: Upsert PlayerMatchStats
    for (const player of statsArr) {
      const finalDamage = Array.isArray(player['stats.player_damage'])
        ? player['stats.player_damage'].slice(-1)[0]
        : (player['stats.player_damage'] ?? 0);
      const finalHealing = Array.isArray(player['stats.player_healing'])
        ? player['stats.player_healing'].slice(-1)[0]
        : (player['stats.player_healing'] ?? 0);

      await db.query(
        `INSERT INTO PlayerMatchStats
          (match_id, player_id, hero_id, souls, kills, deaths, assists, damage_done, healing_done, result, team)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           hero_id=VALUES(hero_id),
           souls=VALUES(souls),
           kills=VALUES(kills),
           deaths=VALUES(deaths),
           assists=VALUES(assists),
           damage_done=VALUES(damage_done),
           healing_done=VALUES(healing_done),
           result=VALUES(result),
           team=VALUES(team)`,
        [
          player.match_id,
          player.account_id,
          player.hero_id,
          player.net_worth ?? 0,
          player.kills,
          player.deaths,
          player.assists,
          finalDamage,
          finalHealing,
          player.won ? 1 : 0,
          player.team ?? null
        ]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      seededMatches: matchIds.length,
      seededPlayers: uniquePlayerIds.length,
      seededPlayerIds: uniquePlayerIds  
    }), { status: 200 });

  } catch (err: any) {
    console.error('Error in seed-player endpoint:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}