// app/api/fetch-heroes/route.ts
import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1/sql';

export async function GET() {
  try {
    const query = encodeURIComponent('SELECT id, name FROM heroes');
    const url = `${DEADLOCK_API_BASE}?query=${query}`;

    console.log('Fetching:', url);

    const res = await fetch(url);
    if (!res.ok) {
      console.error('Heroes fetch failed:', res.status, await res.text());
      throw new Error('Failed to fetch heroes');
    }

    const heroes = await res.json();

    // Upsert heroes into the database
    for (const hero of heroes) {
      await db.query(
        `INSERT INTO Heroes (hero_id, hero_name)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
           hero_name = VALUES(hero_name)`,
        [hero.id, hero.name]
      );
    }

    return new Response(JSON.stringify({ success: true, heroes }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}