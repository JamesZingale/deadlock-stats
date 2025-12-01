'use client';
//src\app\page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [playerId, setPlayerId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;
    router.push(`/player/${playerId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Search Player</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Player ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>
    </div>
  );
}
