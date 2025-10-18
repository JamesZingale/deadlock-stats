import { db } from '../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    return new Response(JSON.stringify({ success: true, rows }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}