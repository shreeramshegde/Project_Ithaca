import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGame } from '../context/GameContext.jsx';
import { findIslandBySlug, ISLANDS } from '../data/islands.js';
import { getIslandQuestions } from '../data/questionsData.js';
import GameHud from '../components/GameHud.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import QuestionConsole from '../components/QuestionConsole.jsx';
import RewardPanel from '../components/RewardPanel.jsx';
import LotusIslandUI from '../components/islands/LotusIslandUI.jsx';
import CyclopsIslandUI from '../components/islands/CyclopsIslandUI.jsx';
import SirensIslandUI from '../components/islands/SirensIslandUI.jsx';
import WitchIslandUI from '../components/islands/WitchIslandUI.jsx';
import HintModal from '../components/common/HintModal.jsx';
import SitOutModal from '../components/common/SitOutModal.jsx';
import '../journey-map.css';
import '../island-ui.css';

export default function IslandPage() {
  const { islandSlug } = useParams();
  const navigate = useNavigate();
  const { team } = useAuth();
  const {
    gameState,
    submitPreRound,
    submitAnswer,
    useHint,
    useReward,
    advanceToNextIsland,
    activeHint,
    setActiveHint,
    sitOutModalOpen,
    setSitOutModalOpen,
  } = useGame();

  const [feedback, setFeedback] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const island = findIslandBySlug(islandSlug);
  const currentIslandId = gameState.current_island || 1;

  // If island is locked or beyond current, redirect to map
  useEffect(() => {
    if (!island) {
      navigate('/journey', { replace: true });
      return;
    }
    if (island.id > currentIslandId) {
      navigate('/journey', { replace: true });
      return;
    }
    if (island.slug === 'ithaca' || currentIslandId > 4) {
      navigate('/victory', { replace: true });
    }
  }, [island, currentIslandId, navigate]);

  // Questions for this island
  const islandData = useMemo(() => {
    return island ? getIslandQuestions(island.id) : null;
  }, [island]);

  // Check pre-round status
  const preRoundQuestion = islandData?.preRound || null;
  const preRoundProgress = preRoundQuestion ? gameState.progress[preRoundQuestion.id] : null;
  const isPreRoundAttempted = Boolean(preRoundProgress);

  // Main questions + penalty pool
  const mainQuestions = useMemo(() => {
    if (!islandData?.questions) return [];
    return islandData.questions.map((q) => ({
      ...q,
      status: gameState.progress[q.id]?.status || null,
    }));
  }, [islandData, gameState.progress]);

  const penaltyQuestions = useMemo(() => {
    if (!islandData?.penaltyPool) return [];
    return islandData.penaltyPool.map((q) => ({
      ...q,
      status: gameState.progress[q.id]?.status || null,
    }));
  }, [islandData, gameState.progress]);

  // Determine active question
  const activeMainQuestion = useMemo(() => {
    if (!isPreRoundAttempted) return null;

    // 1. If user manually selected a question (non-sequential islands: 1, 3, 4)
    if (selectedQuestionId) {
      const selected = [...mainQuestions, ...penaltyQuestions].find((q) => q.id === selectedQuestionId);
      if (selected && !selected.status) return selected;
    }

    // 2. Check if any active penalty question needs solving on Island 1
    if (island?.id === 1 && gameState.activePenaltyIndex > 0) {
      const triggeredPenalties = penaltyQuestions.slice(0, Math.min(gameState.activePenaltyIndex, penaltyQuestions.length));
      const activePenalty = triggeredPenalties.find((pq) => !pq.status);
      if (activePenalty) return activePenalty;
    }

    // 3. For sequential island (Cyclops - Island 2), pick first unsolved step
    if (island?.isSequential) {
      return mainQuestions.find((q) => q.status !== 'CORRECT') || null;
    }

    // 4. Default: first unattempted question
    return mainQuestions.find((q) => !q.status) || null;
  }, [isPreRoundAttempted, island, gameState.activePenaltyIndex, penaltyQuestions, selectedQuestionId, mainQuestions]);

  // Check if island is completed
  const isIslandCompleted = useMemo(() => {
    if (!isPreRoundAttempted || !island || mainQuestions.length === 0) return false;

    if (island.id === 2) {
      // Island 2 (Cyclops) is strictly sequential: each boulder must be solved
      return mainQuestions.every((q) => q.status === 'CORRECT');
    }

    if (island.id === 1) {
      // Island 1: All main questions attempted + any triggered penalty questions attempted
      const allBaseAttempted = mainQuestions.every((q) => Boolean(q.status));
      const triggeredPenalties = penaltyQuestions.slice(0, Math.min(gameState.activePenaltyIndex, penaltyQuestions.length));
      const allPenaltiesAttempted = triggeredPenalties.every((pq) => Boolean(pq.status));
      return allBaseAttempted && allPenaltiesAttempted;
    }

    // Island 3 and 4: Non-sequential, single-attempt per question
    return mainQuestions.every((q) => Boolean(q.status));
  }, [isPreRoundAttempted, island, mainQuestions, penaltyQuestions, gameState.activePenaltyIndex]);

  // Handlers
  const handlePreRoundSubmit = async (payload) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await submitPreRound(island.id, payload.selected_option);
      setFeedback({
        kind: res.isCorrect ? 'success' : res.isTrap ? 'error' : 'info',
        title: res.isCorrect ? 'Ritual Complete' : res.isTrap ? 'Hidden Trap Triggered!' : 'Oracle Answered',
        message: res.message,
      });
    } catch (err) {
      setFeedback({
        kind: 'error',
        title: 'Ritual Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (payload) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await submitAnswer(island.id, payload.question_id, payload.answer_string);
      setFeedback({
        kind: res.isCorrect ? 'success' : 'error',
        title: res.isCorrect ? 'Correct Solution!' : 'Incorrect Solution',
        message: res.message,
      });
      // Reset manual selection so it auto-picks next question
      setSelectedQuestionId(null);
    } catch (err) {
      setFeedback({
        kind: 'error',
        title: 'Submission Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseHint = async () => {
    setLoading(true);
    try {
      const qId = activeMainQuestion?.id || preRoundQuestion?.id;
      const hint = await useHint(qId);
      setFeedback({
        kind: 'info',
        title: 'Oracle Hint Received',
        message: `Hint: "${hint}"`,
      });
    } catch (err) {
      setFeedback({
        kind: 'error',
        title: 'Hint Unavailable',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseReward = async (payload) => {
    setLoading(true);
    try {
      const res = await useReward(payload.reward_type, payload.target_question_id || activeMainQuestion?.id, payload);
      setFeedback({
        kind: 'success',
        title: 'Artifact Unleashed',
        message: res.message,
      });
    } catch (err) {
      setFeedback({
        kind: 'error',
        title: 'Unable to Use Artifact',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextIsland = async () => {
    setLoading(true);
    try {
      await advanceToNextIsland(island.id);
      if (island.id >= 4) {
        navigate('/victory');
      } else {
        const nextIsland = ISLANDS.find((i) => i.id === island.id + 1);
        if (nextIsland && nextIsland.slug !== 'ithaca') {
          navigate(`/journey/${nextIsland.slug}`);
        } else {
          navigate('/journey');
        }
      }
    } catch (err) {
      setFeedback({
        kind: 'error',
        title: 'Navigation Error',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!island) return null;

  return (
    <main className={`page-shell island-page ${island.themeClass}`}>
      <div className="page-content journey-layout">
        <GameHud
          teamName={team?.team_name}
          state={gameState}
          previousYears={gameState.remaining_years}
          extraHints={gameState.extra_hints}
          sitOutPenaltyActive={gameState.sitOutPenaltyActive}
        />

        <section className="journey-main">
          <header className="island-hero">
            <div>
              <span className="eyebrow" style={{ color: '#c6a56a' }}>
                Stage {island.id} of 4 &bull; {island.pathLabel}
              </span>
              <h1 className="display-title">{island.name}</h1>
              <p className="hero-blurb">{island.blurb}</p>
            </div>
            <Link to="/journey" className="ghost-button cinematic-button">
              ← Return to Ocean Map
            </Link>
          </header>

          <FeedbackBanner result={feedback} />

          {/* Dedicated Island Visual Indicator Component */}
          <div className="island-visual-wrapper">
            {island.slug === 'lotus' && (
              <LotusIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                onSelectQuestion={(id) => setSelectedQuestionId(id)}
                penaltyQuestions={penaltyQuestions}
                activePenaltyIndex={gameState.activePenaltyIndex}
              />
            )}
            {island.slug === 'cyclops' && (
              <CyclopsIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                hasCyclopsEye={gameState.inventory.some((i) => i.reward_type === 'CYCLOPS_EYE' && !i.is_used)}
                onUseCyclopsEye={(qId) => handleUseReward({ reward_type: 'CYCLOPS_EYE', target_question_id: qId })}
              />
            )}
            {island.slug === 'sirens' && (
              <SirensIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                onSelectQuestion={(id) => setSelectedQuestionId(id)}
              />
            )}
            {island.slug === 'witch' && (
              <WitchIslandUI
                mainQuestions={mainQuestions}
                activeMainQuestion={activeMainQuestion}
                onSelectQuestion={(id) => setSelectedQuestionId(id)}
                hasSitOutPenalty={gameState.sitOutPenaltyActive}
              />
            )}
          </div>

          {/* Question Console */}
          <QuestionConsole
            island={island}
            loading={loading}
            isCompleted={isIslandCompleted}
            onNextIsland={handleNextIsland}
            preRoundQuestion={!isPreRoundAttempted ? preRoundQuestion : null}
            mainQuestion={isPreRoundAttempted ? activeMainQuestion : null}
            onSubmitPreRound={handlePreRoundSubmit}
            onSubmitAnswer={handleAnswerSubmit}
            eliminatedOptions={gameState.cyclopsEliminatedOptions}
            hasCyclopsEye={gameState.inventory.some((i) => i.reward_type === 'CYCLOPS_EYE' && !i.is_used)}
            onUseCyclopsEye={(qId) => handleUseReward({ reward_type: 'CYCLOPS_EYE', target_question_id: qId })}
          />

          {/* Reward & Inventory Controls */}
          <RewardPanel
            inventory={gameState.inventory}
            loading={loading}
            hintsLeft={gameState.standard_hints_left}
            extraHints={gameState.extra_hints}
            currentIslandSlug={island.slug}
            activeQuestionId={activeMainQuestion?.id}
            hasActiveSitOut={gameState.sitOutPenaltyActive}
            onUseHint={handleUseHint}
            onUseReward={handleUseReward}
          />
        </section>
      </div>

      <HintModal hint={activeHint} onClose={() => setActiveHint(null)} />
      <SitOutModal
        isOpen={sitOutModalOpen}
        onClose={() => setSitOutModalOpen(false)}
        onConfirmMember={() => {}}
      />
    </main>
  );
}
