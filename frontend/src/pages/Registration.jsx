import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerTeam } from '../api';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';

export default function Registration() {
  const [teamName, setTeamName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerTeam,
    onSuccess: (res) => {
      localStorage.setItem('token', res.token);
      navigate('/play');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Registration failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({ team_name: teamName, auth_code: authCode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-odyssey-dark p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative overflow-hidden">
        
        {/* Thematic Background Element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-odyssey-blue via-odyssey-gold to-odyssey-blue"></div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-900 rounded-full border-2 border-odyssey-gold shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            <Ship size={48} className="text-odyssey-gold" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-white mb-2 uppercase tracking-widest">Project Ithaca</h1>
        <p className="text-center text-slate-400 mb-8 italic">"Leave your 20 years behind to return home."</p>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-slate-300 text-sm uppercase tracking-wider mb-2 font-semibold">Team Name</label>
            <input 
              type="text" 
              required
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="w-full p-4 rounded bg-slate-900 text-white border border-slate-600 focus:border-odyssey-gold focus:ring-1 focus:ring-odyssey-gold focus:outline-none transition-colors"
              placeholder="The Argonauts"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm uppercase tracking-wider mb-2 font-semibold">Authentication Code</label>
            <input 
              type="password" 
              required
              value={authCode}
              onChange={e => setAuthCode(e.target.value)}
              className="w-full p-4 rounded bg-slate-900 text-white border border-slate-600 focus:border-odyssey-gold focus:ring-1 focus:ring-odyssey-gold focus:outline-none transition-colors"
              placeholder="Ask the Event Coordinator"
            />
          </div>

          <button 
            type="submit" 
            disabled={registerMutation.isPending}
            className="mt-4 w-full bg-odyssey-gold hover:bg-yellow-400 text-black font-bold text-lg uppercase tracking-widest py-4 rounded transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? 'Boarding...' : 'Begin Journey'}
          </button>
        </form>
      </div>
    </div>
  );
}
