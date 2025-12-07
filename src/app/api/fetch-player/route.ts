// src/app/api/fetch-player/route.ts
import { db } from "../../lib/db";

const DEADLOCK_API_BASE = "https://api.deadlock-api.com";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("player_id");

    if (!playerId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing player_id" }),
        { status: 400 }
      );
    }

    const accountId = Number(playerId);

    // --- Fetch Steam username ---
    const steamUrl = `${DEADLOCK_API_BASE}/v1/players/steam?account_ids=${accountId}`;
    const steamRes = await fetch(steamUrl);

    let username = "Unknown";
    if (steamRes.ok) {
      const steamProfiles = await steamRes.json();
      if (steamProfiles.length > 0) {
        username = steamProfiles[0].personaname || "Unknown";
      }
    }

    // --- Fetch hero stats (to compute matches, wins, losses) ---
    const heroStatsUrl = `${DEADLOCK_API_BASE}/v1/players/hero-stats?account_ids=${accountId}`;
    const heroStatsRes = await fetch(heroStatsUrl);

    if (!heroStatsRes.ok) {
      throw new Error("Failed to fetch hero stats");
    }

    const heroStats = await heroStatsRes.json();

    let totalMatches = 0;
    let totalWins = 0;

    for (const h of heroStats) {
      totalMatches += h.matches_played || 0;
      totalWins += h.wins || 0;
    }

    const totalLosses = totalMatches - totalWins;

    // --- Upsert player into the database ---
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

    return new Response(
      JSON.stringify({
        success: true,
        player: {
          player_id: accountId,
          username,
          total_matches_played: totalMatches,
          total_wins: totalWins,
          total_losses: totalLosses,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("fetch-player error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
