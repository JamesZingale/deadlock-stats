// app/api/fetch-matches/route.ts
import { db } from '../../lib/db';

const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1/sql';

export async function GET() {
  try {
    const matchId = 45125446;
    const query = encodeURIComponent(
      `SELECT match_id, start_time, duration_s, match_outcome, match_mode, winning_team FROM match_info WHERE match_id = ${matchId}`
    );

    const url = `${DEADLOCK_API_BASE}?query=${query}`;
    console.log('Fetching:', url);

    const res = await fetch(url);
    if (!res.ok) {
      console.error('Match fetch failed:', res.status, await res.text());
      throw new Error('Failed to fetch match');
    }

    const matches = await res.json();
    console.log('Fetched matches:', matches);

    for (const match of matches) {
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
    }

    return new Response(JSON.stringify({ success: true, matches }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}