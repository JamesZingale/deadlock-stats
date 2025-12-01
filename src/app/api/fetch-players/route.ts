// app/api/fetch-players/route.ts
import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com';

export async function GET() {
  try {
    // Step 1: Get active matches
    const matchesRes = await fetch(`${DEADLOCK_API_BASE}/v1/matches/active`);
    if (!matchesRes.ok) {
      console.error('Failed to fetch active matches:', matchesRes.status);
      throw new Error('Failed to fetch active matches');
    }
    const matches = await matchesRes.json();

    // Step 2: Collect up to 12 unique account IDs
    const accountIds = new Set<number>();
    for (const match of matches) {
      if (match.players) {
        for (const p of match.players) {
          if (p.account_id) accountIds.add(p.account_id);
          if (accountIds.size >= 12) break;
        }
      }
      if (accountIds.size >= 12) break;
    }

    const accountIdList = Array.from(accountIds);
    if (accountIdList.length === 0) {
      throw new Error('No player IDs found');
    }

    console.log(`Found ${accountIdList.length} player IDs:`, accountIdList);

    // Step 3: Fetch hero stats for all IDs
    const heroStatsUrl = `${DEADLOCK_API_BASE}/v1/players/hero-stats?account_ids=${accountIdList.join(',')}`;
    console.log('Fetching hero stats:', heroStatsUrl);

    const heroStatsRes = await fetch(heroStatsUrl);
    if (!heroStatsRes.ok) {
      console.error('Hero stats fetch failed:', heroStatsRes.status, await heroStatsRes.text());
      throw new Error('Failed to fetch hero stats');
    }
    const heroStats = await heroStatsRes.json();

    // Step 4: Fetch Steam profiles for all IDs
    const steamUrl = `${DEADLOCK_API_BASE}/v1/players/steam?account_ids=${accountIdList.join(',')}`;
    console.log('Fetching steam profiles:', steamUrl);
    const steamRes = await fetch(steamUrl);
    const steamProfiles = steamRes.ok ? await steamRes.json() : [];

    // Step 5: Map Steam usernames by ID
    const usernameMap: Record<number, string> = {};
    for (const profile of steamProfiles) {
      usernameMap[profile.account_id] = profile.personaname || 'Unknown';
    }

    // Step 6: Aggregate stats and upsert into DB
    const groupedStats: Record<number, { matches: number; wins: number }> = {};

    for (const hero of heroStats) {
      const id = hero.account_id;
      if (!groupedStats[id]) groupedStats[id] = { matches: 0, wins: 0 };
      groupedStats[id].matches += hero.matches_played || 0;
      groupedStats[id].wins += hero.wins || 0;
    }

    for (const [idStr, stats] of Object.entries(groupedStats)) {
      const accountId = Number(idStr);
      const totalMatches = stats.matches;
      const totalWins = stats.wins;
      const totalLosses = totalMatches - totalWins;
      const username = usernameMap[accountId] || 'Unknown';

      console.log(`Inserting/updating player ${accountId}: ${username}`);

      await db.query(
        `INSERT INTO Players (player_id, username, total_matches_played, total_wins, total_losses)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           username = VALUES(username),
           total_matches_played = VALUES(total_matches_played),
           total_wins = VALUES(total_wins),
           total_losses = VALUES(total_losses)`,
        [accountId, username, totalMatches, totalWins, totalLosses]
      );
    }

    return new Response(JSON.stringify({ success: true, count: Object.keys(groupedStats).length }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
