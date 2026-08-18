import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGameState, getQuestions } from '../api';
import HUD from '../components/HUD';
import Island1 from '../components/Island1';
import IslandSequential from '../components/IslandSequential';
import QuestionCard from '../components/QuestionCard';

export default function Dashboard() {
  const { data: stateData, isLoading: stateLoading } = useQuery({ queryKey: ['gameState'], queryFn: getGameState });
  const { data: qData, isLoading: qLoading } = useQuery({ queryKey: ['questions'], queryFn: getQuestions });

  const currentIsland = stateData?.data?.team?.current_island;
  
  // Track pre-round completion locally per island
  const [preRoundDone, setPreRoundDone] = useState(() => {
    return localStorage.getItem(`ithaca_preround_${currentIsland}`) === 'true';
  });

  useEffect(() => {
    if (currentIsland) {
      setPreRoundDone(localStorage.getItem(`ithaca_preround_${currentIsland}`) === 'true');
    }
  }, [currentIsland]);

  const handlePreRoundAnswered = () => {
    localStorage.setItem(`ithaca_preround_${currentIsland}`, 'true');
    setPreRoundDone(true);
  };

  if (stateLoading || qLoading) {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold text-odyssey-gold animate-pulse">Consulting the Oracle...</div>;
  }

  const team = stateData?.data?.team;
  if (team?.is_completed) {
    window.location.href = '/victory';
    return null;
  }

  const questions = qData?.data?.questions || [];
  const preRoundQuestion = questions[0];

  return (
    <div className="min-h-screen bg-odyssey-dark">
      <HUD />
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        {!preRoundDone ? (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-odyssey-gold">The Island Guardian demands an answer!</h2>
            <QuestionCard 
              question={preRoundQuestion} 
              isPreRound={true} 
              onAnswered={handlePreRoundAnswered}
              forceRetryOnWrong={false} // Pre-round gives a penalty and moves on
            />
          </div>
        ) : (
          <div className="w-full">
            {currentIsland === 1 ? (
              <Island1 questions={questions} />
            ) : (
              <IslandSequential questions={questions} currentIsland={currentIsland} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
