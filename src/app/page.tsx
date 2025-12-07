'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(`/api/get-player-id?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        alert('Player not found');
        return;
      }

      const data = await res.json();
      router.push(`/player/${data.playerId}`);
    } catch (err) {
      console.error('Error searching player:', err);
      alert('Failed to search player');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)] p-8 text-black" style={{ backgroundColor: 'rgba(136, 166, 191, 0.8)' }}>

      <div className="flex flex-col items-center gap-32"> 
        {/* Search Section */}
        <div className="flex flex-col items-center mt-8">
          <p className="mb-4 text-xl font-semibold text-black">Search for a player's profile</p>
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Enter Player ID or Username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-cyan-400 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Bottom Cards */}
        <div className="flex justify-between w-full max-w-5xl mx-auto gap-6">
          {/* Heroes Card */}
          <div className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded shadow-md hover:bg-opacity-50 transition-colors w-1/2 text-black">
            <h3 className="font-bold text-lg mb-2 text-black">Explore Heroes</h3>
            <p className="mb-3 text-sm text-black">Discover the different heroes in Deadlock.</p>
            <Link href="/heroes" className="bg-cyan-500 text-black px-3 py-1 rounded hover:bg-cyan-400 transition-colors">
              Go to Heroes
            </Link>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded shadow-md hover:bg-opacity-50 transition-colors w-1/2 text-black">
            <h3 className="font-bold text-lg mb-2 text-black">Top Players</h3>
            <p className="mb-3 text-sm text-black">See how the top players play Deadlock.</p>
            <Link href="/leaderboard" className="bg-cyan-500 text-black px-3 py-1 rounded hover:bg-cyan-400 transition-colors">
              Go to Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
