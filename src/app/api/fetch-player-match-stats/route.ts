import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1/sql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('match_id');
    const accountId = searchParams.get('account_id');

    if (!matchId || !accountId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing match_id or account_id' }),
        { status: 400 }
      );
    }

    const query = encodeURIComponent(`
      SELECT match_id, account_id, hero_id, net_worth, kills, deaths, assists, stats.player_damage,
      stats.player_healing, won, team
      FROM match_player
      WHERE match_id = ${matchId} AND account_id = ${accountId}
    `);

    const url = `${DEADLOCK_API_BASE}?query=${query}`;
    console.log('Fetching:', url);

    const res = await fetch(url);
    if (!res.ok) {
      console.error('Deadlock API fetch failed:', res.status, await res.text());
      throw new Error('Failed to fetch player match stats');
    }

    const stats = await res.json();

    if (!Array.isArray(stats) || stats.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No stats found for this player/match' }),
        { status: 404 }
      );
    }

    const player = stats[0];
    console.log('Player object:', JSON.stringify(player, null, 2));

    // Extract final (latest) values from arrays
    const finalDamage = Array.isArray(player['stats.player_damage'])
      ? player['stats.player_damage'][player['stats.player_damage'].length - 1]
      : player['stats.player_damage'] ?? 0;

    const finalHealing = Array.isArray(player['stats.player_healing'])
      ? player['stats.player_healing'][player['stats.player_healing'].length - 1]
      : player['stats.player_healing'] ?? 0;

    // Upsert into local DB
    await db.query(
      `
      INSERT INTO PlayerMatchStats (
        match_id, player_id, hero_id, souls, kills, deaths, assists,
        damage_done, healing_done, result, team
      )
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
        team = VALUES(team)
      `,
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
        player.team ?? null,
      ]
    );

    return new Response(JSON.stringify({ success: true, player }), { status: 200 });
  } catch (err: any) {
    console.error('Error in fetch-player-match-stats:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}