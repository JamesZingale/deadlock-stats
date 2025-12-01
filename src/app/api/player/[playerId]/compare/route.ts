import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { RowDataPacket } from "mysql2";

interface AvgStatsResponse extends RowDataPacket {
  games_played: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  avg_souls: number;
  avg_damage: number;
  avg_healing: number;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ playerId: string }> }
) {
  try {
    // NEXTJS 15: await context.params
    const { playerId } = await context.params;
    const playerIdNum = Number(playerId);

    if (isNaN(playerIdNum)) {
      return NextResponse.json({ error: "Invalid playerId" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    if (!date1 || !date2) {
      return NextResponse.json({ error: "Both dates are required" }, { status: 400 });
    }

    // Query average stats for each date
    const [rows1] = await db.query<AvgStatsResponse[]>(
      `
      SELECT 
        COUNT(*) AS games_played,
        AVG(kills) AS avg_kills,
        AVG(deaths) AS avg_deaths,
        AVG(assists) AS avg_assists,
        AVG(souls) AS avg_souls,
        AVG(damage_done) AS avg_damage,
        AVG(healing_done) AS avg_healing
      FROM playermatchstats pm
      JOIN matches m ON pm.match_id = m.match_id
      WHERE pm.player_id = ? AND DATE(m.start_time) = ?
      `,
      [playerIdNum, date1]
    );

    const [rows2] = await db.query<AvgStatsResponse[]>(
      `
      SELECT 
        COUNT(*) AS games_played,
        AVG(kills) AS avg_kills,
        AVG(deaths) AS avg_deaths,
        AVG(assists) AS avg_assists,
        AVG(souls) AS avg_souls,
        AVG(damage_done) AS avg_damage,
        AVG(healing_done) AS avg_healing
      FROM playermatchstats pm
      JOIN matches m ON pm.match_id = m.match_id
      WHERE pm.player_id = ? AND DATE(m.start_time) = ?
      `,
      [playerIdNum, date2]
    );

    return NextResponse.json({
      date1: rows1[0] || null,
      date2: rows2[0] || null,
    });
  } catch (error: any) {
    console.error("API /player/compare error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}