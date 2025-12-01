"use client";

import { useState, useEffect } from "react";
import MatchScoreboardModal from "../../components/MatchScoreboardModal";
import Image from "next/image";


interface Match {
  match_id: number;
  hero_id: number;
  hero_name: string;
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match) => (
          <div
            key={match.match_id}
            className="bg-white dark:bg-neutral-900 rounded shadow p-4 flex flex-col space-y-2 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openModal(match.match_id)}
          >
            <div className="flex justify-between">
              <span className="font-semibold">Match #{match.match_id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{match.match_mode}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Image
                  src={`/hero-icons/${match.hero_name}.png`}
                  alt={match.hero_name}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span>{match.hero_name}</span>
              </div>
              <span>Winner: {match.winning_team}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>K/D/A: {match.kills}/{match.deaths}/{match.assists}</span>
              <span>Damage: {match.damage_done}</span>
              <span>Healing: {match.healing_done}</span>
            </div>
          </div>
        ))}
      </div>
      <MatchScoreboardModal
        matchId={selectedMatchId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
