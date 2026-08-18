import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGameState, useReward } from '../api';
import { Map, Clock, Lightbulb, Package, Zap } from 'lucide-react';

export default function HUD() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['gameState'], queryFn: getGameState });
  const [errorMsg, setErrorMsg] = useState('');

  const rewardMutation = useMutation({
    mutationFn: useReward,
    onSuccess: (res) => {
      alert(res.message + (res.hint ? `\nHint: ${res.hint}` : ''));
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to use reward');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  });

  if (isLoading || !data) return <div className="p-4 bg-odyssey-dark border-b border-odyssey-gold">Loading HUD...</div>;

  const { team, inventory } = data.data;

  return (
    <div className="bg-slate-900 text-white p-4 border-b-4 border-odyssey-gold sticky top-0 z-50 shadow-xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Time Remaining</span>
            <div className="flex items-center gap-2 text-2xl font-bold text-odyssey-gold">
              <Clock className="text-odyssey-gold" />
              {team.remaining_years} Years
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Current Island</span>
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Map className="text-odyssey-blue" />
              Island {team.current_island}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Hints Left</span>
            <div className="flex items-center gap-2 text-xl">
              <Lightbulb className="text-yellow-400" />
              {team.standard_hints_left}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Inventory</span>
            <div className="flex items-center gap-2">
              {inventory.length === 0 ? (
                <span className="text-gray-500 text-sm italic">Empty</span>
              ) : (
                inventory.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => {
                      if(window.confirm(`Use ${item.reward_type}?`)) {
                        rewardMutation.mutate({ reward_type: item.reward_type });
                      }
                    }}
                    className="flex items-center gap-1 bg-odyssey-blue/20 hover:bg-odyssey-blue/40 border border-odyssey-blue px-2 py-1 rounded text-sm transition-colors"
                  >
                    <Package size={16} />
                    {item.reward_type.replace('_', ' ')}
                  </button>
                ))
              )}
            </div>
            {errorMsg && <div className="text-odyssey-danger text-xs mt-1 absolute -bottom-4">{errorMsg}</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
