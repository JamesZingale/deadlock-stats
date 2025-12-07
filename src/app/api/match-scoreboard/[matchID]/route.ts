import { db } from '../../../lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const matchIdStr = url.pathname.split('/').pop(); // get last segment
    const matchId = Number(matchIdStr);

    if (!matchId) {
      return new Response(JSON.stringify({ error: 'Missing matchId' }), { status: 400 });
    }

    // Fetch match info
    const [matchRows]: any = await db.query(
      `SELECT match_mode, winning_team FROM Matches WHERE match_id = ?`,
      [matchId]
    );
    const match = matchRows[0] || null;

    // Fetch player stats
    const [statsRows]: any = await db.query(
      `SELECT pm.player_id, p.username, h.hero_name, pm.kills, pm.deaths, pm.assists,
              pm.souls, pm.damage_done, pm.healing_done, pm.result, pm.team
       FROM PlayerMatchStats pm
       JOIN Players p ON pm.player_id = p.player_id
       JOIN Heroes h ON pm.hero_id = h.hero_id
       WHERE pm.match_id = ?`,
      [matchId]
    );

    // Group players by team
    const teams: Record<string, typeof statsRows> = {};
    statsRows.forEach((p: any) => {
      if (!teams[p.team]) teams[p.team] = [];
      teams[p.team].push(p);
    });

    return new Response(JSON.stringify({ match, teams }), { status: 200 });
  } catch (err: any) {
    console.error('Error fetching match scoreboard:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
