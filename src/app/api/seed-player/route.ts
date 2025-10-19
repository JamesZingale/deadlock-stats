// app/api/seed-player/route.ts
import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let accountId = searchParams.get('account_id');

    // Step 1: If no account_id, fetch one active player
    if (!accountId) {
      const matchesRes = await fetch(`${DEADLOCK_API_BASE}/matches/active`);
      if (!matchesRes.ok) throw new Error('Failed to fetch active matches');

      const matches = await matchesRes.json();
      const playerIds: number[] = [];
      for (const match of matches) {
        if (match.players) {
          for (const p of match.players) {
            if (p.account_id) playerIds.push(p.account_id);
          }
        }
        if (playerIds.length > 0) break; // limit to one player
      }

      if (playerIds.length === 0) throw new Error('No active player found');
    const randomIndex = Math.floor(Math.random() * playerIds.length);
    accountId = playerIds[randomIndex].toString();
    
    }

    // Step 2: Fetch hero stats for the account
    const heroStatsUrl = `${DEADLOCK_API_BASE}/players/hero-stats?account_ids=${accountId}`;
    const heroStatsRes = await fetch(heroStatsUrl);
    if (!heroStatsRes.ok) throw new Error('Failed to fetch hero stats');
    const heroStats = await heroStatsRes.json();

    // Step 3: Fetch Steam profile for the account
    const steamUrl = `${DEADLOCK_API_BASE}/players/steam?account_ids=${accountId}`;
    const steamRes = await fetch(steamUrl);
    const steamProfiles = steamRes.ok ? await steamRes.json() : [];
    const usernameMap: Record<number, string> = {};
    for (const profile of steamProfiles) {
      usernameMap[profile.account_id] = profile.personaname || 'Unknown';
    }

    // Step 4: Aggregate stats and upsert into Players table
    let totalMatches = 0;
    let totalWins = 0;
    for (const hero of heroStats) {
      totalMatches += hero.matches_played || 0;
      totalWins += hero.wins || 0;
    }
    const totalLosses = totalMatches - totalWins;
    const username = usernameMap[Number(accountId)] || 'Unknown';

    await db.query(
      `INSERT INTO Players (player_id, username, total_matches_played, total_wins, total_losses)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         username = VALUES(username),
         total_matches_played = VALUES(total_matches_played),
         total_wins = VALUES(total_wins),
         total_losses = VALUES(total_losses)`,
      [Number(accountId), username, totalMatches, totalWins, totalLosses]
    );

    // Step 5: Fetch all match IDs for this player
    const matchQuery = encodeURIComponent(`
      SELECT DISTINCT match_id
      FROM match_player
      WHERE account_id = ${accountId}
      LIMIT 5
    `);
    const matchesUrl = `${DEADLOCK_API_BASE}/sql?query=${matchQuery}`;
    const matchesRes2 = await fetch(matchesUrl);
    const text = await matchesRes2.text();

    let matchIds: any[] = [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        matchIds = parsed;
      } else if (parsed.rows && Array.isArray(parsed.rows)) {
        matchIds = parsed.rows;
      } else {
        console.warn('Unexpected match IDs response:', parsed);
      }
    } catch (err) {
      console.error('Failed to parse matches JSON, raw response:', text);
      throw new Error('Invalid JSON returned from Deadlock SQL endpoint');
    }

    // Step 6: Loop over matches and upsert into Matches and PlayerMatchStats
    for (const matchRow of matchIds) {
      const matchId = matchRow.match_id;
      if (!matchId) continue;

      // Fetch match info
      const matchInfoQuery = encodeURIComponent(`
        SELECT match_id, start_time, duration_s, match_outcome, match_mode, winning_team
        FROM match_info
        WHERE match_id = ${matchId}
      `);
      const matchInfoUrl = `${DEADLOCK_API_BASE}/sql?query=${matchInfoQuery}`;
      const matchInfoRes = await fetch(matchInfoUrl);
      const matchInfoArr = await matchInfoRes.json();
      const match = matchInfoArr[0];
      if (!match) continue;

      await db.query(
        `INSERT INTO Matches (match_id, start_time, duration_s, match_outcome, match_mode, winning_team)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           start_time = VALUES(start_time),
           duration_s = VALUES(duration_s),
           match_outcome = VALUES(match_outcome),
           match_mode = VALUES(match_mode),
           winning_team = VALUES(winning_team)`,
        [match.match_id, match.start_time, match.duration_s, match.match_outcome, match.match_mode, match.winning_team]
      );

      // Fetch player stats for this match
      const statsQuery = encodeURIComponent(`
        SELECT match_id, account_id, hero_id, net_worth, kills, deaths, assists,
               stats.player_damage, stats.player_healing, won, team
        FROM match_player
        WHERE match_id = ${matchId} AND account_id = ${accountId}
      `);
      const statsUrl = `${DEADLOCK_API_BASE}/sql?query=${statsQuery}`;
      const statsRes = await fetch(statsUrl);
      const statsArr = await statsRes.json();
      if (!statsArr || statsArr.length === 0) continue;

      const player = statsArr[0];

      // Take only the top value for damage and healing
        const maxDamage = Array.isArray(player['stats.player_damage'])
        ? player['stats.player_damage'].slice(-1)[0]
        : (player['stats.player_damage'] ?? 0);

        const maxHealing = Array.isArray(player['stats.player_healing'])
        ? player['stats.player_healing'].slice(-1)[0]
        : (player['stats.player_healing'] ?? 0);


      await db.query(
        `INSERT INTO PlayerMatchStats
          (match_id, player_id, hero_id, souls, kills, deaths, assists,
           damage_done, healing_done, result, team)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           hero_id = VALUES(hero_id),
           souls = VALUES(souls),
           kills = VALUES(kills),
           deaths = VALUES(deaths),
           assists = VALUES(assists),
           damage_done = VALUES(damage_done),
           healing_done = VALUES(healing_done),
           result = VALUES(result),
           team = VALUES(team)`,
        [
          player.match_id,
          player.account_id,
          player.hero_id,
          player.net_worth,
          player.kills,
          player.deaths,
          player.assists,
          maxDamage,
          maxHealing,
          player.won ? 1 : 0,
          player.team,
        ]
      );
    }

    return new Response(JSON.stringify({ success: true, account_id: Number(accountId) }), { status: 200 });
  } catch (err: any) {
    console.error('Error in seed-player endpoint:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}