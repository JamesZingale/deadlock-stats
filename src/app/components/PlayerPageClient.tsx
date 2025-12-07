"use client";

import { useState } from "react";
import SessionComparisonModal from "./SessionComparisonModal";
import PlayerMatches from "../player/[playerId]/playermatches";

interface Match {
  match_id: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  damage_done: number;
  healing_done: number;
  match_mode: string;
  winning_team: string;
}

interface Player {
  username: string;
  total_matches_played: number;
  total_wins: number;
  total_losses: number;
}

interface Props {
  playerInfo: Player;
  matches: Match[];
  playerId: number;
}

export default function PlayerPageClient({ playerInfo, matches, playerId }: Props) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [refreshingMatches, setRefreshingMatches] = useState(false);

  const refreshPlayerData = async () => {
    try {
      setRefreshingStats(true);
      const res = await fetch(`/api/fetch-player?player_id=${playerId}`);
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      alert("Player stats refreshed!");
    } catch (err) {
      console.error(err);
      alert("Failed to refresh player stats");
    } finally {
      setRefreshingStats(false);
    }
  };

  const seedRecentMatches = async () => {
    try {
      setRefreshingMatches(true);
      const res = await fetch(`/api/seed-player?account_id=${playerId}`);
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      alert(`Seeded ${data.seededMatches} recent matches for player ${playerId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to seed recent matches");
    } finally {
      setRefreshingMatches(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Username: {playerInfo.username}</h1>
      <div className="border border-gray-300 dark:border-gray-700 p-4 rounded bg-white dark:bg-neutral-900 shadow mb-6">
        <p><strong>Total Matches:</strong> {playerInfo.total_matches_played}</p>
        <p><strong>Total Wins:</strong> {playerInfo.total_wins}</p>
        <p><strong>Total Losses:</strong> {playerInfo.total_losses}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={refreshPlayerData}
          className="px-3 py-1 bg-blue-600 text-white rounded"
          disabled={refreshingStats}
        >
          {refreshingStats ? "Refreshing Stats..." : "Refresh Player Stats"}
        </button>

        <button
          onClick={seedRecentMatches}
          className="px-3 py-1 bg-green-600 text-white rounded"
          disabled={refreshingMatches}
        >
          {refreshingMatches ? "Seeding Matches..." : "Seed Recent Matches"}
        </button>

        <button
          onClick={() => setCompareOpen(true)}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          Compare Sessions
        </button>
      </div>

      <SessionComparisonModal
        playerId={playerId}
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
      />

      <h2 className="text-xl font-semibold mb-2">Recent Matches</h2>
      <PlayerMatches matches={matches} />
    </div>
  );
}
