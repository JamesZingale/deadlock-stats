"use client";

import { useState, useEffect } from "react";

interface AvgStatsResponse {
  games_played: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  avg_souls: number;
  avg_damage: number;
  avg_healing: number;
}

interface Props {
  playerId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionComparisonModal({ playerId, isOpen, onClose }: Props) {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [stats, setStats] = useState<{ date1?: AvgStatsResponse; date2?: AvgStatsResponse }>({});

  useEffect(() => {
    if (!isOpen || !date1 || !date2) return;

    async function fetchStats() {
      const res = await fetch(`/api/player/${playerId}/compare?date1=${date1}&date2=${date2}`);
      const data = await res.json();

      // Convert averages to numbers to safely use toFixed
      const processedStats: { date1?: AvgStatsResponse; date2?: AvgStatsResponse } = {};
      if (data.date1) {
        processedStats.date1 = {
          games_played: data.date1.games_played,
          avg_kills: Number(data.date1.avg_kills),
          avg_deaths: Number(data.date1.avg_deaths),
          avg_assists: Number(data.date1.avg_assists),
          avg_souls: Number(data.date1.avg_souls),
          avg_damage: Number(data.date1.avg_damage),
          avg_healing: Number(data.date1.avg_healing),
        };
      }
      if (data.date2) {
        processedStats.date2 = {
          games_played: data.date2.games_played,
          avg_kills: Number(data.date2.avg_kills),
          avg_deaths: Number(data.date2.avg_deaths),
          avg_assists: Number(data.date2.avg_assists),
          avg_souls: Number(data.date2.avg_souls),
          avg_damage: Number(data.date2.avg_damage),
          avg_healing: Number(data.date2.avg_healing),
        };
      }

      setStats(processedStats);
    }

    fetchStats();
  }, [playerId, date1, date2, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Compare Sessions</h2>

        <div className="flex gap-2 mb-4">
          <div>
            <label>Date 1: </label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Date 2: </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mb-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Close
        </button>

        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-neutral-800">
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Games Played</th>
              <th className="border px-2 py-1">Kills</th>
              <th className="border px-2 py-1">Deaths</th>
              <th className="border px-2 py-1">Assists</th>
              <th className="border px-2 py-1">Souls</th>
              <th className="border px-2 py-1">Damage</th>
              <th className="border px-2 py-1">Healing</th>
            </tr>
          </thead>
          <tbody>
            {["date1", "date2"].map((d) => {
              const s = stats[d as "date1" | "date2"];
              if (!s) return null;

              return (
                <tr key={d}>
                  <td className="border px-2 py-1">{d === "date1" ? date1 : date2}</td>
                  <td className="border px-2 py-1">{s.games_played}</td>
                  <td className="border px-2 py-1">{s.avg_kills.toFixed(1)}</td>
                  <td className="border px-2 py-1">{s.avg_deaths.toFixed(1)}</td>
                  <td className="border px-2 py-1">{s.avg_assists.toFixed(1)}</td>
                  <td className="border px-2 py-1">{s.avg_souls.toFixed(1)}</td>
                  <td className="border px-2 py-1">{s.avg_damage.toFixed(1)}</td>
                  <td className="border px-2 py-1">{s.avg_healing.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}