"use client";

import { useEffect, useState } from "react";

interface PlayerStat {
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

interface Props {
  matchId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchScoreboardModal({ matchId, isOpen, onClose }: Props) {
  const [teams, setTeams] = useState<Record<string, PlayerStat[]>>({});
  const [matchInfo, setMatchInfo] = useState<any>(null);

  useEffect(() => {
    if (!matchId || !isOpen) return;

    async function fetchStats() {
      const res = await fetch(`/api/match/${matchId}`);
      const data = await res.json();

      setTeams(data.teams || {});
      setMatchInfo(data.match || null);
    }

    fetchStats();
  }, [matchId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">
          Match {matchId} Scoreboard
        </h2>

        {matchInfo && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            <p>Mode: {matchInfo.match_mode}</p>
            <p>Winning Team: {matchInfo.winning_team}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mb-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Close
        </button>

        {Object.entries(teams).map(([team, players]) => (
          <div key={team} className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{team}</h3>

            <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-neutral-800">
                  <th className="border px-2 py-1">Username</th>
                  <th className="border px-2 py-1">Hero</th>
                  <th className="border px-2 py-1">K</th>
                  <th className="border px-2 py-1">D</th>
                  <th className="border px-2 py-1">A</th>
                  <th className="border px-2 py-1">Souls</th>
                  <th className="border px-2 py-1">Damage</th>
                  <th className="border px-2 py-1">Healing</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{p.username}</td>
                    <td className="border px-2 py-1">{p.hero_name}</td>
                    <td className="border px-2 py-1">{p.kills}</td>
                    <td className="border px-2 py-1">{p.deaths}</td>
                    <td className="border px-2 py-1">{p.assists}</td>
                    <td className="border px-2 py-1">{p.souls}</td>
                    <td className="border px-2 py-1">{p.damage_done}</td>
                    <td className="border px-2 py-1">{p.healing_done}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}