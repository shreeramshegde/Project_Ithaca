import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { QUESTIONS_DATA, getIslandQuestions } from '../data/questionsData.js';
import { findIslandById } from '../data/islands.js';
import * as gameApi from '../api/game.js';

const GameContext = createContext(null);

const STORAGE_GAME_STATE = 'ithaca_local_game_state_v2';

const INITIAL_GAME_STATE = {
  remaining_years: 20.0,
  current_island: 1,
  standard_hints_left: 3,
  extra_hints: 0, // Athena's scroll grants +1 hint on Island 1
  inventory: [], // [{ id, reward_type, is_used, acquired_at }]
  progress: {}, // { [question_id]: { status: 'CORRECT'|'INCORRECT', attempted_at, answer } }
  sitOutPenaltyActive: false, // Witch sit-out flag
  sitOutMemberName: null,
  activePenaltyIndex: 0, // For Island 1 penalty questions
  cyclopsEliminatedOptions: {}, // { [question_id]: string }
  start_time: null,
  end_time: null,
  is_completed: false,
};

export function GameProvider({ children }) {
  const { token, team, saveSession, clearSession } = useAuth();
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GAME_STATE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_GAME_STATE;
  });

  const [activeHint, setActiveHint] = useState(null);
  const [blessingModalOpen, setBlessingModalOpen] = useState(false);
  const [sitOutModalOpen, setSitOutModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAME_STATE, JSON.stringify(gameState));
    } catch {
      // ignore
    }
  }, [gameState]);

  // If new session logged in, set start time if null
  useEffect(() => {
    if (token && !gameState.start_time) {
      setGameState((prev) => ({
        ...prev,
        start_time: prev.start_time || new Date().toISOString(),
      }));
    }
  }, [token, gameState.start_time]);

  // Submit Pre-round GK MCQ
  const submitPreRound = useCallback(
    async (islandId, selectedOption) => {
      const islandQuestions = getIslandQuestions(islandId);
      if (!islandQuestions?.preRound) {
        throw new Error('Pre-round question not found');
      }

      const preQ = islandQuestions.preRound;
      const isCorrect = selectedOption.trim().toLowerCase() === preQ.correct_answer.trim().toLowerCase();
      let deltaYears = 0;
      let rewardEarned = null;
      let message = '';
      let isTrap = false;

      // Island 3: Hidden Wrong Answer Trap (+2.0 years)
      if (islandId === 3 && preQ.hidden_wrong_answer && selectedOption.trim().toLowerCase() === preQ.hidden_wrong_answer.trim().toLowerCase()) {
        isTrap = true;
        deltaYears = +2.0;
        message = 'Deceptive Siren Song! You fell for the Hidden Wrong Answer. (+2.0 Years added to your journey!)';
      } else if (isCorrect) {
        rewardEarned = preQ.reward;
        if (islandId === 1) {
          message = "Athena's Scroll Acquired! You gain +1 free hint for Island 1!";
        } else if (islandId === 2) {
          message = "Cyclops Eye Acquired! You can eliminate 1 wrong option in an MCQ!";
        } else if (islandId === 3) {
          deltaYears = -2.0;
          message = "Hermes' Sandals Acquired! Swift flight reduces your journey by -2.0 Years!";
        } else if (islandId === 4) {
          message = "The Blessing of Hermes Acquired! Choose how to wield divine power!";
        }
      } else {
        message = 'Incorrect pre-round choice. The spirits offer no divine favor for this island.';
      }

      // Try backend if token exists
      if (token) {
        try {
          await gameApi.submitPreRound(token, { question_id: preQ.id, selected_option: selectedOption });
        } catch {
          // Fallback to local
        }
      }

      // Update local state
      setGameState((prev) => {
        const nextYears = Math.max(0, parseFloat((prev.remaining_years + deltaYears).toFixed(2)));
        const newInventory = [...prev.inventory];
        let extraHints = prev.extra_hints;

        if (rewardEarned) {
          newInventory.push({
            id: `reward-${Date.now()}`,
            reward_type: rewardEarned,
            is_used: false,
            acquired_at: new Date().toISOString(),
          });
          if (rewardEarned === 'ATHENAS_SCROLL') {
            extraHints += 1;
          }
        }

        return {
          ...prev,
          remaining_years: nextYears,
          extra_hints: extraHints,
          inventory: newInventory,
          progress: {
            ...prev.progress,
            [preQ.id]: {
              status: isCorrect ? 'CORRECT' : 'INCORRECT',
              attempted_at: new Date().toISOString(),
              answer: selectedOption,
              isTrap,
            },
          },
        };
      });

      return {
        isCorrect,
        isTrap,
        rewardEarned,
        message,
        deltaYears,
      };
    },
    [token]
  );

  // Submit Main Answer
  const submitAnswer = useCallback(
    async (islandId, questionId, answerString) => {
      const islandQuestions = getIslandQuestions(islandId);
      const islandMeta = findIslandById(islandId);
      if (!islandQuestions || !islandMeta) {
        throw new Error('Island data not found');
      }

      const allList = [...(islandQuestions.questions || []), ...(islandQuestions.penaltyPool || [])];
      const targetQ = allList.find((q) => q.id === questionId);
      if (!targetQ) {
        throw new Error('Question not found');
      }

      const trimmedAns = answerString.trim().toLowerCase().replace(/\s+/g, ' ');
      let isCorrect = false;

      if (targetQ.format === 'MCQ') {
        isCorrect = trimmedAns === targetQ.correct_answer.trim().toLowerCase();
      } else {
        // Non-MCQ: Check against array of valid answers with normalized whitespace
        const validList = Array.isArray(targetQ.correct_answer)
          ? targetQ.correct_answer.map((a) => a.trim().toLowerCase().replace(/\s+/g, ' '))
          : [targetQ.correct_answer.trim().toLowerCase().replace(/\s+/g, ' ')];
        isCorrect = validList.some((ans) => ans === trimmedAns);
      }

      let deltaYears = 0;
      let isWitchSitOutTriggered = false;
      let isTrapTriggered = false;

      if (isCorrect) {
        deltaYears = islandMeta.scoring.correct; // negative number
        // If island 4 and sit-out was active, correct answer clears it
        if (islandId === 4) {
          isWitchSitOutTriggered = false;
        }
      } else {
        // Check for Island 3 trap answer in main trials if any
        if (islandId === 3 && targetQ.hidden_wrong_answers) {
          const trapList = targetQ.hidden_wrong_answers.map((t) => t.trim().toLowerCase());
          if (trapList.includes(trimmedAns)) {
            isTrapTriggered = true;
            deltaYears = islandMeta.scoring.mainTrapPenalty || +3.0;
          } else {
            deltaYears = islandMeta.scoring.incorrect; // positive
          }
        } else {
          deltaYears = islandMeta.scoring.incorrect; // positive
        }

        // Island 4 Witch Sit-out rule:
        if (islandId === 4) {
          isWitchSitOutTriggered = true;
        }
      }

      // Try backend if token exists
      if (token) {
        try {
          await gameApi.submitAnswer(token, { question_id: questionId, answer_string: answerString });
        } catch {
          // Fallback to local
        }
      }

      // Update local state
      setGameState((prev) => {
        const nextYears = Math.max(0, parseFloat((prev.remaining_years + deltaYears).toFixed(2)));
        let nextPenaltyIndex = prev.activePenaltyIndex;
        if (islandId === 1 && !isCorrect) {
          nextPenaltyIndex += 1;
        }

        return {
          ...prev,
          remaining_years: nextYears,
          activePenaltyIndex: nextPenaltyIndex,
          sitOutPenaltyActive: isWitchSitOutTriggered ? true : islandId === 4 && isCorrect ? false : prev.sitOutPenaltyActive,
          progress: {
            ...prev.progress,
            [questionId]: {
              status: isCorrect ? 'CORRECT' : 'INCORRECT',
              attempted_at: new Date().toISOString(),
              answer: answerString,
              isTrap: isTrapTriggered,
            },
          },
        };
      });

      if (isWitchSitOutTriggered) {
        setSitOutModalOpen(true);
      }

      return {
        isCorrect,
        deltaYears,
        isWitchSitOutTriggered,
        isTrapTriggered,
        message: isCorrect
          ? `Correct answer! ${deltaYears} Years deducted from journey!`
          : isTrapTriggered
          ? `Siren Trap Triggered! +${deltaYears} Years added to journey!`
          : `Incorrect answer. +${deltaYears} Years added to journey!`,
      };
    },
    [token]
  );

  // Use standard or Athena hint
  const useHint = useCallback(
    async (questionId) => {
      if (gameState.extra_hints <= 0 && gameState.standard_hints_left <= 0) {
        throw new Error('No hints remaining!');
      }

      // Find question hint
      let foundHint = 'Take a moment to carefully analyze the requirements and edge cases.';
      Object.values(QUESTIONS_DATA).forEach((island) => {
        const q = [...(island.questions || []), ...(island.penaltyPool || []), island.preRound].find((item) => item?.id === questionId);
        if (q?.hint) {
          foundHint = q.hint;
        }
      });

      if (token) {
        try {
          const res = await gameApi.useHint(token);
          if (res?.hint) foundHint = res.hint;
        } catch {
          // fallback
        }
      }

      setGameState((prev) => {
        if (prev.extra_hints > 0) {
          return { ...prev, extra_hints: prev.extra_hints - 1 };
        }
        return { ...prev, standard_hints_left: Math.max(0, prev.standard_hints_left - 1) };
      });

      setActiveHint(foundHint);
      return foundHint;
    },
    [gameState.extra_hints, gameState.standard_hints_left, token]
  );

  // Use Reward Item (Cyclops Eye, The Blessing, Hermes' Sandals)
  const useReward = useCallback(
    async (rewardType, targetQuestionId, payload = {}) => {
      const rewardItem = gameState.inventory.find((r) => r.reward_type === rewardType && !r.is_used);
      if (!rewardItem) {
        throw new Error(`You do not have an active ${rewardType} in inventory.`);
      }

      let message = '';

      if (rewardType === 'CYCLOPS_EYE') {
        if (!targetQuestionId) throw new Error('Target question required for Cyclops Eye.');
        // Find question option to eliminate
        const island2Questions = getIslandQuestions(2);
        const q = island2Questions?.questions?.find((item) => item.id === targetQuestionId);
        if (!q || q.format !== 'MCQ') throw new Error('Cyclops Eye can only be used on Island 2 MCQs.');

        const wrongOption = q.wrong_to_eliminate || q.options.find((opt) => opt !== q.correct_answer);
        setGameState((prev) => ({
          ...prev,
          cyclopsEliminatedOptions: {
            ...prev.cyclopsEliminatedOptions,
            [targetQuestionId]: wrongOption,
          },
          inventory: prev.inventory.map((inv) => (inv.id === rewardItem.id ? { ...inv, is_used: true } : inv)),
        }));
        message = `Cyclops Eye activated! Eliminated incorrect option: "${wrongOption}"`;
      } else if (rewardType === 'THE_BLESSING') {
        const choice = payload.choice || 'YEARS_DEDUCTION'; // 'BYPASS_SIT_OUT' or 'YEARS_DEDUCTION'
        if (choice === 'BYPASS_SIT_OUT') {
          setGameState((prev) => ({
            ...prev,
            sitOutPenaltyActive: false,
            inventory: prev.inventory.map((inv) => (inv.id === rewardItem.id ? { ...inv, is_used: true } : inv)),
          }));
          message = "The Blessing used! The sit-out penalty has been lifted immediately!";
        } else {
          setGameState((prev) => ({
            ...prev,
            remaining_years: Math.max(0, parseFloat((prev.remaining_years - 3.0).toFixed(2))),
            inventory: prev.inventory.map((inv) => (inv.id === rewardItem.id ? { ...inv, is_used: true } : inv)),
          }));
          message = "The Blessing used! -3.0 Years deducted from your journey time!";
        }
      }

      if (token) {
        try {
          await gameApi.useReward(token, { reward_type: rewardType, target_question_id: targetQuestionId });
        } catch {
          // fallback
        }
      }

      return { message };
    },
    [gameState.inventory, token]
  );

  // Advance to next island
  const advanceToNextIsland = useCallback(async (fromIslandId) => {
    setGameState((prev) => {
      const current = prev.current_island || 1;
      // If fromIslandId is provided and we are already past it, do not increment again
      if (fromIslandId && current > fromIslandId) {
        return prev;
      }
      const nextIslandId = current + 1;
      const isComplete = nextIslandId > 4;
      return {
        ...prev,
        current_island: nextIslandId,
        extra_hints: nextIslandId > 1 ? 0 : prev.extra_hints,
        is_completed: isComplete,
        end_time: isComplete ? new Date().toISOString() : prev.end_time,
      };
    });

    if (token) {
      try {
        await gameApi.nextIsland(token);
      } catch {
        // fallback
      }
    }
  }, [token]);

  // Reset / Start fresh
  const resetGame = useCallback(() => {
    setGameState({
      ...INITIAL_GAME_STATE,
      start_time: new Date().toISOString(),
    });
    localStorage.removeItem(STORAGE_GAME_STATE);
  }, []);

  const value = useMemo(
    () => ({
      gameState,
      setGameState,
      activeHint,
      setActiveHint,
      blessingModalOpen,
      setBlessingModalOpen,
      sitOutModalOpen,
      setSitOutModalOpen,
      submitPreRound,
      submitAnswer,
      useHint,
      useReward,
      advanceToNextIsland,
      resetGame,
    }),
    [
      gameState,
      activeHint,
      blessingModalOpen,
      sitOutModalOpen,
      submitPreRound,
      submitAnswer,
      useHint,
      useReward,
      advanceToNextIsland,
      resetGame,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
