import React, { useState } from 'react';
import { ISLANDS, REWARD_LABELS } from '../data/islands.js';
import JourneyYears from './JourneyYears.jsx';
import RulesModal from './common/RulesModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function GameHud({ teamName, state, previousYears, flashValue, extraHints = 0, sitOutPenaltyActive = false, onOpenRules }) {
  const { clearSession } = useAuth();
  const [rulesOpen, setRulesOpen] = useState(false);

  const currentIslandId = state?.team?.current_island || state?.current_island || 1;
  const currentIsland = ISLANDS.find((island) => island.id === currentIslandId);
  const remainingYears = state?.team?.remaining_years ?? state?.remaining_years ?? 20.0;
  const standardHints = state?.team?.standard_hints_left ?? state?.standard_hints_left ?? 3;
  const inventory = state?.inventory || [];

  return (
    <>
      <aside className="hud cinematic-hud">
        {/* Top Header Card */}
        <section className="hud-panel hud-brand">
          <div className="hud-brand-header">
            <span className="hud-gold-symbol">✦</span>
            <div>
              <p className="eyebrow">Project Ithaca &bull; NISB</p>
              <h2 className="hud-title">The Tech Odyssey</h2>
            </div>
          </div>
          <div className="hud-island-badge">
            <span className="island-badge-icon">🏝️</span>
            <span>{currentIsland?.name || 'Open Ocean'}</span>
          </div>
        </section>

        {/* Years Remaining Countdown Display */}
        <JourneyYears
          years={remainingYears}
          previousYears={previousYears}
          flashValue={flashValue}
        />

        {/* Sit-out Curse Banner if Active */}
        {sitOutPenaltyActive && (
          <div className="hud-sitout-badge">
            <span>🧙‍♀️</span>
            <strong>Witch's Sit-Out Curse Active</strong>
          </div>
        )}

        {/* Crew & Hints Info */}
        <section className="hud-panel hud-card">
          <div className="hud-meta">
            <div>
              <p className="eyebrow">Crew</p>
              <h3 className="hud-crew-name">{teamName || 'Unnamed Crew'}</h3>
            </div>
            <div>
              <p className="eyebrow">Hints Remaining</p>
              <div className="hud-hints-count">
                <strong className="hint-number">{standardHints}</strong>
                {extraHints > 0 && (
                  <span className="athena-extra-pill" title="Athena's Scroll Extra Hint">
                    +{extraHints} Athena
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hud-meta" style={{ marginTop: '0.75rem' }}>
            <div>
              <p className="eyebrow">Island Progress</p>
              <span>Island {currentIslandId} of 4</span>
            </div>
            <div>
              <p className="eyebrow">Status</p>
              <span className="status-indicator">
                {currentIslandId > 4 ? '⚓ Ithaca Reached!' : '🌊 Navigating'}
              </span>
            </div>
          </div>
        </section>

        {/* Artifacts & Inventory */}
        <section className="hud-panel hud-card">
          <p className="eyebrow">Divine Artifacts in Hold</p>
          <div className="inventory-list">
            {inventory.length ? (
              inventory.map((item, idx) => (
                <span key={item.id || idx} className={`inventory-item ${item.is_used ? 'used' : 'active'}`}>
                  {REWARD_LABELS[item.reward_type] || item.reward_type}
                  {item.is_used && ' (Used)'}
                </span>
              ))
            ) : (
              <p className="muted-copy">No artifacts in the hold yet. Clear pre-round trials to earn divine favor.</p>
            )}
          </div>
        </section>

        {/* Action Controls */}
        <div className="hud-actions">
          <button
            type="button"
            className="ghost-button hud-btn"
            onClick={() => (onOpenRules ? onOpenRules() : setRulesOpen(true))}
          >
            📜 Rules & Lore
          </button>
          <button
            type="button"
            className="ghost-button hud-btn danger-hover"
            onClick={clearSession}
            title="Leave Session"
          >
            Leave
          </button>
        </div>
      </aside>

      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  );
}

export default GameHud;
