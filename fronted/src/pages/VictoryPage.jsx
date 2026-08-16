import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGame } from '../context/GameContext.jsx';

export default function VictoryPage() {
  const { team } = useAuth();
  const { gameState } = useGame();

  const durationText = useMemo(() => {
    if (!gameState.start_time) return '45 mins';
    const start = new Date(gameState.start_time).getTime();
    const end = gameState.end_time ? new Date(gameState.end_time).getTime() : Date.now();
    const diffSec = Math.max(1, Math.floor((end - start) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${mins}m ${secs}s`;
  }, [gameState.start_time, gameState.end_time]);

  const solvedQuestionsCount = Object.values(gameState.progress).filter((p) => p.status === 'CORRECT').length;

  return (
    <main className="page-shell victory-page">
      <div className="victory-container cinematic-panel">
        <div className="victory-crest">
          <span className="victory-symbol">🏛️</span>
          <span className="gold-sparkle">✦ ✦ ✦</span>
        </div>

        <p className="eyebrow" style={{ color: '#c6a56a', letterSpacing: '0.2em' }}>
          PROJECT ITHACA &bull; NISB IEEE
        </p>

        <h1 className="victory-title">Odysseus Has Returned Home</h1>
        <p className="victory-subtitle">
          Through perilous reefs, stone giants, siren songs, and Circe's spells, your crew has navigated the Odyssey and arrived on the golden shores of Ithaca.
        </p>

        <div className="victory-stats-grid">
          <div className="victory-stat-card primary">
            <span className="stat-icon">⌛</span>
            <p className="stat-label">Final Journey Duration</p>
            <strong className="stat-number">{Number(gameState.remaining_years).toFixed(2)}</strong>
            <small className="stat-unit">Years Remaining (Started: 20.0)</small>
          </div>

          <div className="victory-stat-card">
            <span className="stat-icon">⏱️</span>
            <p className="stat-label">Total Voyage Time (Tie-Breaker 1)</p>
            <strong className="stat-number">{durationText}</strong>
            <small className="stat-unit">Real Time Elapsed</small>
          </div>

          <div className="victory-stat-card">
            <span className="stat-icon">💡</span>
            <p className="stat-label">Hints Preserved (Tie-Breaker 2)</p>
            <strong className="stat-number">{gameState.standard_hints_left} / 3</strong>
            <small className="stat-unit">Standard Hints Left</small>
          </div>

          <div className="victory-stat-card">
            <span className="stat-icon">⚔️</span>
            <p className="stat-label">Puzzles Conquered</p>
            <strong className="stat-number">{solvedQuestionsCount}</strong>
            <small className="stat-unit">Trials Cleared Across 4 Islands</small>
          </div>
        </div>

        <div className="crew-honor-card">
          <p className="eyebrow">Official Navigator Seal</p>
          <h3>Team: {team?.team_name || 'The Argonauts'}</h3>
          <p className="seal-text">
            Confirmed for final score verification by NISB IEEE judging committee at Sir MV Hall.
          </p>
        </div>

        <div className="victory-actions">
          <Link to="/journey" className="secondary-button cinematic-button">
            🗺️ Revisit Ocean Map
          </Link>
          <Link to="/admin" className="action-button cinematic-button">
            📊 View Live Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
