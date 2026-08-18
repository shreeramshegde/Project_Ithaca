import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { nextIsland } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ship } from 'lucide-react';

export default function Island1({ questions }) {
  const queryClient = useQueryClient();
  
  const [completedNodeIds, setCompletedNodeIds] = useState(() => {
    return JSON.parse(localStorage.getItem('ithaca_i1_completed') || '[]');
  });
  
  const [unlockedPenaltyCount, setUnlockedPenaltyCount] = useState(() => {
    return parseInt(localStorage.getItem('ithaca_i1_penalty_count') || '0', 10);
  });

  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    localStorage.setItem('ithaca_i1_completed', JSON.stringify(completedNodeIds));
  }, [completedNodeIds]);

  useEffect(() => {
    localStorage.setItem('ithaca_i1_penalty_count', unlockedPenaltyCount.toString());
  }, [unlockedPenaltyCount]);

  const baseQuestions = questions.slice(1, 5); // 4 base
  const penaltyPool = questions.slice(5); // 6 penalty
  
  const visiblePenaltyQuestions = penaltyPool.slice(0, unlockedPenaltyCount);
  
  const allVisibleQuestions = [...baseQuestions, ...visiblePenaltyQuestions];
  const isIslandComplete = allVisibleQuestions.length > 0 && allVisibleQuestions.every(q => completedNodeIds.includes(q.id));

  const sailMutation = useMutation({
    mutationFn: nextIsland,
    onSuccess: () => {
      // clear local state for safety
      localStorage.removeItem('ithaca_i1_completed');
      localStorage.removeItem('ithaca_i1_penalty_count');
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to sail');
    }
  });

  const handleAnswer = (isCorrect, qId) => {
    if (isCorrect) {
      setCompletedNodeIds(prev => [...prev, qId]);
      setActiveQuestion(null);
    } else {
      // Wrong on Island 1 -> unlock a penalty node if available
      if (unlockedPenaltyCount < penaltyPool.length) {
        setUnlockedPenaltyCount(prev => prev + 1);
        alert("A new penalty question has appeared on the map!");
      }
      // Stays active because Island 1 forces retry
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-odyssey-gold mb-2">Island of the Lotus Eaters</h2>
        <p className="text-slate-300 mb-6">Beware! A wrong answer here forces you to retry, AND spawns an extra mandatory penalty question on the map.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allVisibleQuestions.map((q, index) => {
            const isCompleted = completedNodeIds.includes(q.id);
            const isPenalty = index >= 4;
            const isSelected = activeQuestion?.id === q.id;

            return (
              <button
                key={q.id}
                disabled={isCompleted}
                onClick={() => setActiveQuestion(q)}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all
                  ${isCompleted ? 'bg-green-600/50 border-4 border-green-500 cursor-not-allowed opacity-50' : 
                    isSelected ? 'bg-white text-black ring-4 ring-white scale-110' : 
                    isPenalty ? 'bg-red-900 border-4 border-red-500 hover:bg-red-800' : 'bg-odyssey-blue border-4 border-blue-400 hover:bg-blue-500'}
                `}
              >
                {isCompleted ? '✓' : (index + 1)}
              </button>
            );
          })}
        </div>
      </div>

      {isIslandComplete && (
        <button 
          onClick={() => sailMutation.mutate()}
          className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl mb-8 animate-bounce"
        >
          <Ship />
          Sail to Next Island
        </button>
      )}

      {!isIslandComplete && activeQuestion && (
        <div className="w-full max-w-2xl">
          <QuestionCard 
            question={activeQuestion} 
            isPreRound={false} 
            onAnswered={handleAnswer}
            forceRetryOnWrong={true} // Crucial for Island 1
          />
        </div>
      )}
    </div>
  );
}
