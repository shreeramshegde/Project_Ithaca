import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
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
import IthacaIslandUI from '../components/islands/IthacaIslandUI.jsx';
import '../journey-map.css';
import '../island-ui.css';

function IslandPage() {
  const { islandSlug } = useParams();
  const island = findIslandBySlug(islandSlug);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, team, clearSession } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showRules, setShowRules] = useState(true);
  const [revealedHints, setRevealedHints] = useState({});
  const [previousYears, setPreviousYears] = useState(team?.remaining_years ?? null);
  const [sirensPuzzleSolved, setSirensPuzzleSolved] = useState(false);
  const [witchSudokuSolved, setWitchSudokuSolved] = useState(false);

  const isPuzzlePending = (island.slug === 'sirens' && !sirensPuzzleSolved) || (island.slug === 'witch' && !witchSudokuSolved);

  const stateQuery = useQuery({
    queryKey: ['game-state', token],
    queryFn: () => getGameState(token),
    refetchInterval: 10000,
  });

  useEffect(() => {
    const currentYears = stateQuery.data?.data?.team?.remaining_years;
    if (currentYears !== undefined && currentYears !== null) {
      setPreviousYears((prev) => (prev === null ? currentYears : prev));
    }
  }, [stateQuery.data?.data?.team?.remaining_years]);

  const currentIsland = stateQuery.data?.data?.team?.current_island;

  const questionsQuery = useQuery({
    queryKey: ['game-questions', token, currentIsland],
    queryFn: () => getQuestions(token),
    enabled: !!currentIsland,
  });

  const refreshState = () => {
    queryClient.invalidateQueries({ queryKey: ['game-state', token] });
    queryClient.invalidateQueries({ queryKey: ['game-questions', token, currentIsland] });
  };

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
    onSuccess: (payload) => {
      refreshState();
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Pre-round failed', message: error.message }),
  });

  const answerMutation = useMutation({
    mutationFn: (payload) => submitAnswer(token, payload),
    onSuccess: (payload) => {
      refreshState();
      if (island?.slug === 'witch' && payload?.is_correct === false) {
        setSitOutRequired(true);
      }
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Submission failed', message: error.message }),
  });

  const nextIslandMutation = useMutation({
    mutationFn: () => nextIsland(token),
    onSuccess: (payload) => {
      setFeedback({
        kind: 'success',
        title: 'Voyage Continues',
        message: payload?.message || 'Setting sail to the next island!',
      });
      refreshState();
      setTimeout(() => {
        navigate('/journey', { state: { traveledFrom: currentIsland } });
      }, 1500);
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Failed to progress', message: error.message }),
  });

  const hintMutation = useMutation({
    mutationFn: (payload) => useHint(token, payload),
    onSuccess: (payload, variables) => {
      const hintText = payload?.hint || payload?.message;
      if (variables?.question_id && payload?.hint) {
        setRevealedHints(prev => ({ ...prev, [variables.question_id]: payload.hint }));
      }
      setFeedback({
        kind: 'info',
        title: 'Divine Hint Received',
        message: hintText || 'A hint was revealed by the fates.',
      });
      refreshState();
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Hint unavailable', message: error.message }),
  });

  const rewardMutation = useMutation({
    mutationFn: (payload) => useReward(token, payload),
    onSuccess: (payload, variables) => {
      if (variables?.target_question_id && payload?.hint) {
        setRevealedHints(prev => ({ ...prev, [variables.target_question_id]: payload.hint }));
      }
      setFeedback({
        kind: 'info',
        title: 'Artifact Invoked',
        message: payload?.message || payload?.hint || 'The artifact has granted its power.',
      });
      refreshState();
    },
    onError: (error) => setFeedback({ kind: 'error', title: 'Reward unavailable', message: error.message }),
  });

  const loading = preRoundMutation.isPending || answerMutation.isPending || hintMutation.isPending || rewardMutation.isPending || nextIslandMutation.isPending;
  const inventory = stateQuery.data?.data?.inventory || [];
  const eliminatedOption = rewardMutation.data?.eliminated_option;

  const [confirmReward, setConfirmReward] = useState(null);

  const handleRewardClick = (rewardType) => {
    setConfirmReward(rewardType);
  };

  const confirmAndExecuteReward = () => {
    if (!confirmReward) return;
    const payload = { reward_type: confirmReward };
    if ((confirmReward === 'CYCLOPS_EYE' || confirmReward === 'ATHENAS_SCROLL') && activeMainQuestion) {
      payload.target_question_id = activeMainQuestion.id;
    }
    rewardMutation.mutate(payload);
    setConfirmReward(null);
  };

  const isLocked = useMemo(() => {
    if (!island || !currentIsland) {
      return false;
    }
    return island.id !== currentIsland;
  }, [currentIsland, island]);

  useEffect(() => {
    animateIslandEntry();
  }, []);

  useEffect(() => {
    if (stateQuery.error?.message === 'Invalid or expired token' || stateQuery.error?.message === 'Team not found') {
      clearSession();
    }
  }, [clearSession, stateQuery.error?.message]);

  if (!island || isLocked) {
    return <Navigate to="/journey" replace />;
  }

  const questions = questionsQuery.data?.data?.questions || [];
  const preRoundQuestion = questions.find(q => q.type === 'PRE_ROUND');
  const isPreRoundComplete = !preRoundQuestion || (preRoundQuestion.progress_status !== null && preRoundQuestion.progress_status !== undefined);

  const mainQuestions = questions.filter(q => q.type === 'MAIN');
  const baseQuestions = mainQuestions.filter(q => q.sequence_number <= 4);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number > 4);

  const totalFailedAttempts = mainQuestions.reduce((acc, q) => acc + (q.progress_status === 'INCORRECT' ? 1 : 0), 0);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);

  let activeMainQuestion = null;
  let isIslandCompleted = false;

  if (mainQuestions.length > 0) {
    if (island.slug === 'lotus') {
      // Island 1 (Lotus): Free choice - any question can be selected in any order
      if (selectedQuestionId) {
        activeMainQuestion = mainQuestions.find(q => q.id === selectedQuestionId) || null;
      }
      if (!activeMainQuestion) {
        activeMainQuestion = baseQuestions.find(q => q.progress_status === null) 
          || unlockedPenaltyQuestions.find(q => q.progress_status === null) 
          || baseQuestions[0] 
          || null;
      }
      
      const allBaseAttempted = baseQuestions.length > 0 && baseQuestions.every(q => q.progress_status !== null);
      const allPenaltyAttempted = unlockedPenaltyQuestions.length === 0 || unlockedPenaltyQuestions.every(q => q.progress_status !== null);
      isIslandCompleted = allBaseAttempted && allPenaltyAttempted;
    } else {
      // Islands 2, 3, 4 (Cyclops, Sirens, Witch): Strictly sequential progression!
      // Must solve question 1 before question 2, and so on.
      const firstUnattempted = mainQuestions.find(q => q.progress_status === null);
      
      if (selectedQuestionId) {
        const selectedQ = mainQuestions.find(q => q.id === selectedQuestionId);
        const selectedIndex = mainQuestions.findIndex(q => q.id === selectedQuestionId);
        // Only allow selecting questions whose previous stages have already been attempted
        const isUnlocked = selectedIndex === 0 || mainQuestions.slice(0, selectedIndex).every(q => q.progress_status !== null);
        if (isUnlocked && selectedQ) {
          activeMainQuestion = selectedQ;
        }
      }

      if (!activeMainQuestion) {
        activeMainQuestion = firstUnattempted || mainQuestions[mainQuestions.length - 1] || null;
      }

      isIslandCompleted = mainQuestions.every(q => q.progress_status !== null);
    }
  }

  // Allow sailing if completed
  const isCurrentlyCompleted = isIslandCompleted;

  return (
    <main className={`page-shell island-page ${island.themeClass}`}>
      {showRules && <RulesModal islandSlug={island.slug} onClose={() => setShowRules(false)} />}
      <div className="page-content journey-layout">
        <GameHud
          teamName={team?.team_name}
          state={stateQuery.data?.data}
          previousYears={previousYears}
          onLogout={clearSession}
        />

        <section className="journey-main">
          <header className="island-hero-cinematic">
            <div className="island-hero-content">
              <div>
                <div className="island-hero-meta">
                  <span className="island-badge-pill">
                    🔱 Island {island.id} of 5
                  </span>
                  <span className={`island-status-pill ${isCurrentlyCompleted ? 'completed' : 'active'}`}>
                    {isCurrentlyCompleted ? '✓ Conquered' : '⚔ In Progress'}
                  </span>
                </div>
                <h1 className="island-hero-title">{island.title}</h1>
                <p className="island-hero-lore">
                  {island.summary || island.subtitle || 'Solve the sacred inscriptions and trials to shorten your voyage.'}
                </p>
              </div>

              <div className="island-hero-actions">
                <button 
                  type="button"
                  className="hero-action-btn"
                  onClick={() => setShowRules(true)}
                  title="Review the laws and lore of this island"
                >
                  📜 Island Rules
                </button>
                <Link to="/journey" className="hero-action-btn">
                  🗺️ Voyage Map
                </Link>
              </div>
            </div>
          </header>

          <FeedbackBanner result={feedback} onClose={() => setFeedback(null)} />

          <div style={{ margin: '10px 0 20px 0' }}>
            {!isPreRoundComplete ? (
              <div className="trials-chamber" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '8px' }}>⛩️</div>
                <h3 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', fontSize: '1.4rem', margin: '0 0 8px 0' }}>
                  The Gateway to {island.title} is Sealed
                </h3>
                <p style={{ color: 'rgba(231, 229, 221, 0.8)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
                  Complete the Oracle's Pre-Round Ritual in the console below to earn a divine artifact and reveal the main trials.
                </p>
              </div>
            ) : (
              <>
                {island.slug === 'lotus' && (
                  <LotusIslandUI 
                    mainQuestions={mainQuestions} 
                    activeMainQuestion={activeMainQuestion} 
                    onSelectQuestion={setSelectedQuestionId}
                    totalFailedAttempts={totalFailedAttempts}
                    hasAthenasScroll={stateQuery.data?.data?.inventory?.some(i => i.reward_type === 'ATHENAS_SCROLL' && !i.is_used)}
                    onScrollClick={() => handleRewardClick('ATHENAS_SCROLL')}
                  />
                )}
                {island.slug === 'cyclops' && (
                  <CyclopsIslandUI
                    mainQuestions={mainQuestions}
                    activeMainQuestion={activeMainQuestion}
                    onSelectQuestion={setSelectedQuestionId}
                    hasCyclopsEye={stateQuery.data?.data?.inventory?.some(i => i.reward_type === 'CYCLOPS_EYE' && !i.is_used)}
                    onEyeClick={() => handleRewardClick('CYCLOPS_EYE')}
                    totalFailedAttempts={totalFailedAttempts}
                  />
                )}
                {island.slug === 'sirens' && (
                  <SirensIslandUI 
                    mainQuestions={mainQuestions} 
                    activeMainQuestion={activeMainQuestion} 
                    onSelectQuestion={setSelectedQuestionId}
                    hasSandals={stateQuery.data?.data?.inventory?.some(i => i.reward_type === 'HERMES_SANDALS' && !i.is_used)}
                    onSandalsClick={() => handleRewardClick('HERMES_SANDALS')}
                    isPuzzleSolved={sirensPuzzleSolved}
                    onSolvePuzzle={() => setSirensPuzzleSolved(true)}
                  />
                )}
                {island.slug === 'witch' && (
                  <WitchIslandUI 
                    mainQuestions={mainQuestions} 
                    activeMainQuestion={activeMainQuestion} 
                    onSelectQuestion={setSelectedQuestionId}
                    hasBlessing={stateQuery.data?.data?.inventory?.some(i => i.reward_type === 'THE_BLESSING' && !i.is_used)}
                    onBlessingClick={() => handleRewardClick('THE_BLESSING')}
                    isPuzzleSolved={witchSudokuSolved}
                    onSolvePuzzle={() => setWitchSudokuSolved(true)}
                  />
                )}
                {island.slug === 'ithaca' && (
                  <div style={{ textAlign: 'center', color: 'var(--cloud-white)' }}>
                    <h2 style={{ fontFamily: 'var(--display)' }}>Welcome Home</h2>
                    <p>The journey is complete.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {island.slug !== 'ithaca' && (
            <div id="question-console-area">
              <QuestionConsole
                island={island}
                preRoundQuestion={!isPreRoundComplete ? preRoundQuestion : null}
                mainQuestion={isPreRoundComplete && !isPuzzlePending ? activeMainQuestion : null}
                revealedHint={activeMainQuestion ? revealedHints[activeMainQuestion.id] : null}
                loading={loading}
                isCompleted={isCurrentlyCompleted}
                onNextIsland={() => nextIslandMutation.mutate()}
                onSubmitPreRound={(payload) => preRoundMutation.mutate(payload)}
                onSubmitAnswer={(payload) => answerMutation.mutate(payload)}
                eliminatedOption={eliminatedOption}
                sitOutRequired={sitOutRequired}
                onSitOutAcknowledge={() => setSitOutRequired(false)}
              />
            </div>
          )}

          {isPreRoundComplete && island.slug !== 'ithaca' && (
            <RewardPanel
              inventory={stateQuery.data?.data?.inventory}
              loading={loading}
              onUseHint={(payload) => hintMutation.mutate(payload)}
              onUseReward={(payload) => rewardMutation.mutate(payload)}
              activeMainQuestion={activeMainQuestion}
              questions={questions}
              currentIslandId={island.id}
            />
          )}
        </section>

        {/* REWARD CONFIRMATION MODAL FOR ISLAND BANNERS */}
        {confirmReward && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(13, 27, 42, 0.98) 0%, rgba(5, 12, 22, 0.98) 100%)',
              border: '2px solid var(--gold)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>
                {confirmReward === 'ATHENAS_SCROLL' ? '📜' : confirmReward === 'CYCLOPS_EYE' ? '👁' : confirmReward === 'HERMES_SANDALS' ? '🪽' : '✨'}
              </span>
              <h3 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: '0 0 10px 0', fontSize: '1.4rem' }}>
                Invoke {confirmReward === 'ATHENAS_SCROLL' ? "Athena's Scroll" : confirmReward === 'CYCLOPS_EYE' ? "Cyclops' Eye" : confirmReward === 'HERMES_SANDALS' ? "Hermes' Sandals" : 'The Blessing'}?
              </h3>
              <p style={{ color: 'rgba(231, 229, 221, 0.85)', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                {confirmReward === 'ATHENAS_SCROLL' && "Reveal an illuminating Oracle clue on the active trial without deducting standard hints."}
                {confirmReward === 'CYCLOPS_EYE' && "Eliminate one treacherous wrong option on this multiple-choice trial."}
                {confirmReward === 'HERMES_SANDALS' && "Instantly bypass Sirens delays and deduct 2 years from your journey."}
                {confirmReward === 'THE_BLESSING' && "Divine grace that shields your crew from Circe and deducts 3 years."}
                <br />
                <strong style={{ color: '#f87171', display: 'block', marginTop: '8px' }}>
                  This artifact can only be used once on this island!
                </strong>
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmReward(null)}
                  className="hero-action-btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAndExecuteReward}
                  className="spoken-submit-btn"
                  style={{ flex: 1, margin: 0, padding: '10px' }}
                  disabled={loading}
                >
                  {loading ? 'Channeling...' : 'Confirm & Invoke'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default IslandPage;
