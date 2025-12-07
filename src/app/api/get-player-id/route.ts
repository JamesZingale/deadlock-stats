import { db } from '../../lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 });
    }

    const [rows]: any = await db.query(
      `SELECT player_id FROM Players WHERE player_id = ? OR username = ? LIMIT 1`,
      [query, query]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ playerId: rows[0].player_id }), { status: 200 });
  } catch (err: any) {
    console.error('Error fetching player ID:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
