import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getGameState, submitAnswer, submitPreRound, useHint, useReward } from '../api/game.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import GameHud from '../components/GameHud.jsx';
import QuestionConsole from '../components/QuestionConsole.jsx';
import RewardPanel from '../components/RewardPanel.jsx';
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

  const stateQuery = useQuery({
    queryKey: ['game-state', token],
    queryFn: () => getGameState(token),
    refetchInterval: 10000,
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

  const hintMutation = useMutation({
    mutationFn: () => useHint(token),
    onSuccess: (payload) =>
      setFeedback({
        kind: 'info',
        title: 'Hint received',
        message: payload?.hint || payload?.message || 'A hint was returned by the backend.',
      }),
    onError: (error) => setFeedback({ kind: 'error', title: 'Hint unavailable', message: error.message }),
  });

  const rewardMutation = useMutation({
    mutationFn: (payload) => useReward(token, payload),
    onSuccess: (payload) => onMutationSuccess('Reward activated', payload),
    onError: (error) => setFeedback({ kind: 'error', title: 'Reward unavailable', message: error.message }),
  });

  const loading = preRoundMutation.isPending || answerMutation.isPending || hintMutation.isPending || rewardMutation.isPending;

  const currentIsland = stateQuery.data?.data?.team?.current_island;
  const isLocked = useMemo(() => {
    if (!island || !currentIsland) {
      return false;
    }
    return island.id > currentIsland;
  }, [currentIsland, island]);

  useEffect(() => {
    animateIslandEntry();
  }, []);

  if (!island || isLocked) {
    return <Navigate to="/journey" replace />;
  }

  return (
    <main className={`page-shell island-page ${island.themeClass}`}>
      <div className="page-content journey-layout">
        <GameHud
          teamName={team?.team_name}
          state={stateQuery.data?.data}
          previousYears={team?.remaining_years}
          onLogout={clearSession}
        />

        <section className="journey-main">
          <div className="surface-panel island-hero">
            <div>
              <p className="eyebrow">Island {island.id}</p>
              <h1 className="display-title">{island.name}</h1>
              <p>{island.title}</p>
            </div>
            <Link className="ghost-button" to="/journey">
              Back to Map
            </Link>
          </div>

          {isLocked ? (
            <FeedbackBanner
              result={{
                kind: 'error',
                title: 'Island locked',
                message: 'The backend state does not currently allow this island to be entered.',
              }}
            />
          ) : null}

          <FeedbackBanner result={feedback} />

          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            {island.slug === 'lotus' && (
              <LotusIslandUI onSelectQuestion={setSelectedQuestionId} selectedId={selectedQuestionId} />
            )}
            {island.slug === 'cyclops' && (
              <CyclopsIslandUI 
                onSelectQuestion={setSelectedQuestionId} 
                selectedId={selectedQuestionId}
                hasCyclopsEye={stateQuery.data?.data?.inventory?.includes('Cyclops Eye')}
              />
            )}
            {island.slug === 'sirens' && (
              <SirensIslandUI onSelectQuestion={setSelectedQuestionId} selectedId={selectedQuestionId} />
            )}
            {island.slug === 'witch' && (
              <WitchIslandUI 
                onSelectQuestion={setSelectedQuestionId} 
                selectedId={selectedQuestionId}
                hasSitOutPenalty={true} // In a real implementation, this comes from backend state
              />
            )}
            {island.slug === 'ithaca' && (
              <div style={{ textAlign: 'center', color: 'var(--cloud-white)' }}>
                <h2 style={{ fontFamily: 'var(--display)' }}>Welcome Home</h2>
                <p>The journey is complete.</p>
              </div>
            )}
          </div>

          {selectedQuestionId && island.slug !== 'ithaca' && (
            <div id="question-console-area">
            <QuestionConsole
              island={island}
              loading={loading}
              onSubmitPreRound={(payload) => preRoundMutation.mutate(payload)}
              onSubmitAnswer={(payload) => answerMutation.mutate(payload)}
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
