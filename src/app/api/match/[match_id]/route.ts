import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { RowDataPacket } from "mysql2";

interface PlayerScore extends RowDataPacket {
  username: string;
  hero_name: string;
  kills: number;
  deaths: number;
  assists: number;
  souls: number;
  damage_done: number;
  healing_done: number;
  result: string;
  team: string;
}

export async function GET(
  req: Request,
  context: { params: { match_id: string } }
) {
  try {
    // Next.js 15: await params
    const { match_id } = await context.params;
    const matchIdNum = Number(match_id);

    if (isNaN(matchIdNum)) {
      return NextResponse.json(
        { error: "Invalid match_id" },
        { status: 400 }
      );
    }

    // Query the stats for this match
    const [rows] = await db.query<PlayerScore[]>(
      `
      SELECT 
        p.username,
        h.hero_name,
        s.kills,
        s.deaths,
        s.assists,
        s.souls,
        s.damage_done,
        s.healing_done,
        s.result,
        s.team
      FROM playermatchstats s
      JOIN players p ON p.player_id = s.player_id
      JOIN heroes h ON h.hero_id = s.hero_id
      WHERE s.match_id = ?
      ORDER BY s.team ASC, s.kills DESC
      `,
      [matchIdNum]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Match not found or has no stats" },
        { status: 404 }
      );
    }

    // group by team
    const teams: Record<string, PlayerScore[]> = {};

    for (const row of rows) {
      if (!teams[row.team]) teams[row.team] = [];
      teams[row.team].push(row);
    }

    return NextResponse.json({
      match_id: matchIdNum,
      teams,
    });
  } catch (error: any) {
    console.error("API /match error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}