import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGameState } from '../api';
import { Home } from 'lucide-react';

export default function Victory() {
  const { data } = useQuery({ queryKey: ['gameState'], queryFn: getGameState });
  const team = data?.data?.team;

  return (
    <div className="min-h-screen flex items-center justify-center bg-odyssey-dark p-4">
      <div className="w-full max-w-2xl bg-slate-800 p-12 rounded-2xl shadow-2xl border-4 border-odyssey-gold text-center">
        
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-odyssey-gold rounded-full text-black">
            <Home size={64} />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 uppercase tracking-widest text-shadow-gold">Welcome Home</h1>
        <p className="text-2xl text-slate-300 mb-8 italic">You have survived the Odyssey.</p>

        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700">
          <h2 className="text-slate-400 uppercase tracking-widest mb-2 text-sm">Final Score</h2>
          <div className="text-6xl font-bold text-odyssey-gold mb-4">
            {team?.remaining_years} Years
          </div>
          <p className="text-slate-400">
            Wait for the Event Coordinators to announce the final standings.
          </p>
        </div>
      </div>
    </div>
  );
}
