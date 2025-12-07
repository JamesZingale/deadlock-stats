import { db } from '../../lib/db';

const HERO_INDEX_URL = 'https://assets.deadlock-api.com/v2/heroes';

export async function GET() {
  try {
    // 1. Fetch hero index (array of hero metadata including IDs)
    const indexRes = await fetch(HERO_INDEX_URL);
    if (!indexRes.ok) {
      throw new Error(`Failed to fetch hero index: ${indexRes.status}`);
    }

    const heroIndex = await indexRes.json();
    if (!Array.isArray(heroIndex)) {
      throw new Error('Hero index response was not an array');
    }

    const heroesProcessed = [];

    // 2. Loop through each hero ID and fetch full details
    for (const h of heroIndex) {
      const heroId = h.id;

      const detailRes = await fetch(`${HERO_INDEX_URL}/${heroId}`);
      if (!detailRes.ok) {
        console.error(`Failed fetching hero ${heroId}:`, detailRes.status);
        continue;
      }

      const detail = await detailRes.json();

      const hero_name = detail.name ?? null;
      const max_health = detail?.starting_stats?.max_health?.value ?? null;
      const role = detail?.description?.role ?? null;

      // 3. Upsert into DB
      await db.query(
        `
        INSERT INTO Heroes (hero_id, hero_name, max_health, role)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          hero_name = VALUES(hero_name),
          max_health = VALUES(max_health),
          role = VALUES(role)
        `,
        [heroId, hero_name, max_health, role]
      );

      heroesProcessed.push({
        hero_id: heroId,
        hero_name,
        max_health,
        role
      });
    }

    return new Response(JSON.stringify({ success: true, heroes: heroesProcessed }), { status: 200 });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
