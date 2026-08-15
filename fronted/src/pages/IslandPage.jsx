import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getGameState, submitAnswer, submitPreRound, useHint, useReward, nextIsland, getQuestions } from '../api/game.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import GameHud from '../components/GameHud.jsx';
import QuestionConsole from '../components/QuestionConsole.jsx';
import RewardPanel from '../components/RewardPanel.jsx';
import RulesModal from '../components/RulesModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { findIslandBySlug } from '../data/islands.js';
import { animateIslandEntry } from '../animations/mapAnimations.js';
import EnvironmentalMarker from '../components/EnvironmentalMarker.jsx';
import LotusIslandUI from '../components/islands/LotusIslandUI.jsx';
import CyclopsIslandUI from '../components/islands/CyclopsIslandUI.jsx';
import SirensIslandUI from '../components/islands/SirensIslandUI.jsx';
import WitchIslandUI from '../components/islands/WitchIslandUI.jsx';
import '../journey-map.css';
import '../island-ui.css';

function IslandPage() {
  const { islandSlug } = useParams();
  const island = findIslandBySlug(islandSlug);
  const queryClient = useQueryClient();
  const { token, team, clearSession } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showRules, setShowRules] = useState(true);

  const stateQuery = useQuery({
    queryKey: ['game-state', token],
    queryFn: () => getGameState(token),
    refetchInterval: 10000,
  });

  const currentIsland = stateQuery.data?.data?.team?.current_island;

  const questionsQuery = useQuery({
    queryKey: ['game-questions', token, currentIsland],
    queryFn: () => getQuestions(token),
    enabled: !!currentIsland,
  });

  const refreshState = () => queryClient.invalidateQueries({ queryKey: ['game-state', token] });

  const onMutationSuccess = (title, payload) => {
    setFeedback({
      kind: 'success',
      title,
      message: payload?.message || 'The backend accepted the action and the latest state is syncing now.',
    });
    refreshState();
  };

  const preRoundMutation = useMutation({
    mutationFn: (payload) => submitPreRound(token, payload),
    onSuccess: (payload) => onMutationSuccess('Pre-round processed', payload),
    onError: (error) => setFeedback({ kind: 'error', title: 'Pre-round failed', message: error.message }),
  });

  const answerMutation = useMutation({
    mutationFn: (payload) => submitAnswer(token, payload),
    onSuccess: (payload) => onMutationSuccess('Answer processed', payload),
    onError: (error) => setFeedback({ kind: 'error', title: 'Submission failed', message: error.message }),
  });

  const nextIslandMutation = useMutation({
    mutationFn: () => nextIsland(token),
    onSuccess: (payload) => {
      onMutationSuccess('Journey Continues', payload);
      // Wait a moment before redirecting to allow the success message to show
      setTimeout(() => {
        window.location.href = '/journey'; // Force full unmount to trigger map entry animations fresh
      }, 1500);
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Failed to progress', message: error.message }),
  });

  const hintMutation = useMutation({
    mutationFn: () => useHint(token),
    onSuccess: (payload) => {
      setFeedback({
        kind: 'info',
        title: 'Hint received',
        message: payload?.hint || payload?.message || 'A hint was returned by the backend.',
      });
      refreshState();
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Hint unavailable', message: error.message }),
  });

  const rewardMutation = useMutation({
    mutationFn: (payload) => useReward(token, payload),
    onSuccess: (payload) => onMutationSuccess('Reward activated', payload),
    onError: (error) => setFeedback({ kind: 'error', title: 'Reward unavailable', message: error.message }),
  });

  const loading = preRoundMutation.isPending || answerMutation.isPending || hintMutation.isPending || rewardMutation.isPending || nextIslandMutation.isPending;
  const inventory = stateQuery.data?.data?.inventory || [];

  const isLocked = useMemo(() => {
    if (!island || !currentIsland) {
      return false;
    }
    return island.id > currentIsland;
  }, [currentIsland, island]);

  useEffect(() => {
    animateIslandEntry();
  }, []);

  useEffect(() => {
    if (stateQuery.error?.message === 'Invalid or expired token') {
      clearSession();
    }
  }, [clearSession, stateQuery.error?.message]);

  if (!island || isLocked) {
    return <Navigate to="/journey" replace />;
  }

  const questions = questionsQuery.data?.data?.questions || [];
  const preRoundQuestion = questions.find(q => q.type === 'PRE_ROUND');
  const isPreRoundComplete = preRoundQuestion?.is_correct;

  const mainQuestions = questions.filter(q => q.type === 'MAIN');
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number >= 10);

  const totalFailedAttempts = mainQuestions.reduce((acc, q) => acc + Number(q.incorrect_attempts || 0), 0);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);

  let activeMainQuestion = null;
  let isIslandCompleted = false;

  if (baseQuestions.length > 0) {
    if (island.slug === 'lotus') {
      activeMainQuestion = mainQuestions.find(q => q.id === selectedQuestionId) || null;
      isIslandCompleted = baseQuestions.every(q => q.is_correct) && unlockedPenaltyQuestions.every(q => q.is_correct);
    } else {
      activeMainQuestion = baseQuestions.find(q => !q.is_correct);
      if (!activeMainQuestion && unlockedPenaltyQuestions.length > 0) {
        activeMainQuestion = unlockedPenaltyQuestions.find(q => !q.is_correct);
      }
      isIslandCompleted = baseQuestions.every(q => q.is_correct) && unlockedPenaltyQuestions.every(q => q.is_correct);
    }
  }

  // Override the local state if the user correctly answers the final question before the query refetches
  const isCurrentlyCompleted = isIslandCompleted || (answerMutation.data?.is_correct && !activeMainQuestion && island.slug !== 'lotus');

  return (
    <main className={`page-shell island-page ${island.themeClass}`}>
      {showRules && <RulesModal islandSlug={island.slug} onClose={() => setShowRules(false)} />}
      <div className="page-content journey-layout">
        <GameHud
          teamName={team?.team_name}
          state={stateQuery.data?.data}
          previousYears={team?.remaining_years}
          onLogout={clearSession}
        />

        <section className="journey-main">
          <header className="island-hero">
            <div>
              <h1 className="display-title">{island.title}</h1>
              <p className="eyebrow">Island {island.id} of 5</p>
            </div>
            <Link to="/journey" className="ghost-button cinematic-button">
              ← View Map
            </Link>
          </header>

          <FeedbackBanner result={feedback} />

          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            {island.slug === 'lotus' && (
              <LotusIslandUI 
                mainQuestions={mainQuestions} 
                activeMainQuestion={activeMainQuestion} 
                totalFailedAttempts={totalFailedAttempts}
                onSelectQuestion={(id) => setSelectedQuestionId(id)}
              />
            )}
            {island.slug === 'cyclops' && (
              <CyclopsIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                hasCyclopsEye={stateQuery.data?.data?.inventory?.some(i => i.reward_type === 'CYCLOPS_EYE')}
              />
            )}
            {island.slug === 'sirens' && (
              <SirensIslandUI mainQuestions={mainQuestions} activeMainQuestion={activeMainQuestion} />
            )}
            {island.slug === 'witch' && (
              <WitchIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                hasSitOutPenalty={hasOutstandingPenalty}
              />
            )}
            {island.slug === 'ithaca' && (
              <div style={{ textAlign: 'center', color: 'var(--cloud-white)' }}>
                <h2 style={{ fontFamily: 'var(--display)' }}>Welcome Home</h2>
                <p>The journey is complete.</p>
              </div>
            )}
          </div>

          {island.slug !== 'ithaca' && (
            <div id="question-console-area">
              <QuestionConsole
                island={island}
                loading={loading}
                preRoundQuestion={!isPreRoundComplete ? preRoundQuestion : null}
                mainQuestion={isPreRoundComplete ? activeMainQuestion : null}
                onSubmitPreRound={(payload) => preRoundMutation.mutate(payload)}
                onSubmitAnswer={(payload) => answerMutation.mutate(payload)}
                isCompleted={isCurrentlyCompleted}
                onNextIsland={() => nextIslandMutation.mutate()}
              />
            </div>
          )}

          <RewardPanel
            inventory={stateQuery.data?.data?.inventory}
            loading={loading}
            onUseHint={() => hintMutation.mutate()}
            onUseReward={(payload) => rewardMutation.mutate(payload)}
          />
        </section>
      </div>
    </main>
  );
}

export default IslandPage;
