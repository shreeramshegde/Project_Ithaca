import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { nextIsland } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ship } from 'lucide-react';

export default function IslandSequential({ questions, currentIsland }) {
  const queryClient = useQueryClient();
  
  // Track index locally. We scope it to the island so it resets automatically per island
  const [currentIndex, setCurrentIndex] = useState(() => {
    return parseInt(localStorage.getItem(`ithaca_seq_idx_${currentIsland}`) || '1', 10);
  });

  useEffect(() => {
    localStorage.setItem(`ithaca_seq_idx_${currentIsland}`, currentIndex.toString());
  }, [currentIndex, currentIsland]);

  const mainQuestions = questions.slice(1);
  // Subtract 1 because currentIndex starts at 1 for the first main question
  const activeQuestion = mainQuestions[currentIndex - 1]; 
  const isIslandComplete = currentIndex > mainQuestions.length;

  const sailMutation = useMutation({
    mutationFn: nextIsland,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to sail');
    }
  });

  const handleAnswer = (isCorrect, qId) => {
    // Sequence rule: ONLY ONE ATTEMPT! Move to next regardless of right or wrong
    setCurrentIndex(prev => prev + 1);
  };

  const islandNames = {
    2: "Island of the Cyclops",
    3: "Island of the Sirens",
    4: "Island of the Witch Circe"
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 w-full max-w-4xl mb-8 text-center">
        <h2 className="text-3xl font-bold text-odyssey-gold mb-2">{islandNames[currentIsland]}</h2>
        <p className="text-slate-300">Sequential Pathway. You only have ONE attempt per question. Tread carefully.</p>
        
        <div className="mt-6 flex justify-center gap-2">
          {mainQuestions.map((q, idx) => (
            <div 
              key={q.id}
              className={`h-3 w-12 rounded-full transition-colors ${
                (currentIndex - 1) > idx ? 'bg-green-500' : 
                (currentIndex - 1) === idx ? 'bg-odyssey-blue animate-pulse' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {isIslandComplete ? (
        <button 
          onClick={() => sailMutation.mutate()}
          className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl animate-bounce"
        >
          <Ship />
          {currentIsland === 4 ? "Complete the Odyssey" : "Sail to Next Island"}
        </button>
      ) : (
        <div className="w-full max-w-2xl">
          <QuestionCard 
            question={activeQuestion} 
            isPreRound={false} 
            onAnswered={handleAnswer}
            forceRetryOnWrong={false} // Crucial for Islands 2,3,4
          />
        </div>
      )}
    </div>
  );
}
