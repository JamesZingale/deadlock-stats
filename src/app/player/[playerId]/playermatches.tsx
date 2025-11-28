"use client";

import { useState, useEffect } from "react";
import MatchScoreboardModal from "../../components/MatchScoreboardModal";

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

interface Props {
  matches: Match[];
}

export default function PlayerMatches({ matches }: Props) {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (id: number) => {
    setSelectedMatchId(id);
    setIsModalOpen(true);
  };

  return (
    <>
      {matches.map((match) => (
        <div
          key={match.match_id}
          className="border border-gray-300 dark:border-gray-700 p-4 mb-4 rounded bg-white dark:bg-neutral-900 shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
          onClick={() => openModal(match.match_id)}
        >
          <p><strong>Match ID:</strong> {match.match_id}</p>
          <p><strong>K/D/A:</strong> {match.kills}/{match.deaths}/{match.assists}</p>
          <p><strong>Damage Done:</strong> {match.damage_done}</p>
          <p><strong>Healing Done:</strong> {match.healing_done}</p>
          <p><strong>Match Mode:</strong> {match.match_mode}</p>
          <p><strong>Winning Team:</strong> {match.winning_team}</p>
        </div>
      ))}

      <MatchScoreboardModal
        matchId={selectedMatchId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}