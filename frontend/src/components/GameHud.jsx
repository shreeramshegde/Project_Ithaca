import { useState } from 'react';
import { ISLANDS, REWARD_LABELS } from '../data/islands.js';
import JourneyYears from './JourneyYears.jsx';

const RELIC_DESCRIPTIONS = {
  ATHENAS_SCROLL: "Athena's Scroll: Reveals island wisdom or bypasses a question's penalty.",
  CYCLOPS_EYE: "Cyclops' Eye: Eliminates one incorrect option from an MCQ trial.",
  HERMES_SANDALS: "Hermes' Sandals: Grants swift passage and speed advantage on the route.",
  THE_BLESSING: "The Blessing: Divine ward against environmental hexes & sit-outs."
};

function RelicIcon({ type }) {
  switch (type) {
    case 'ATHENAS_SCROLL':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"/>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          <path d="M10 9H8"/>
          <path d="M16 13H8"/>
          <path d="M16 17H8"/>
        </svg>
      );
    case 'CYCLOPS_EYE':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case 'HERMES_SANDALS':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      );
    case 'THE_BLESSING':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
  }
}

function GameHud({ teamName, state, previousYears, flashValue, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const currentIslandIndex = state?.team?.current_island ?? 1;
  const currentIsland = ISLANDS.find((island) => island.id === currentIslandIndex);
  const isCompleted = state?.team?.is_completed;

  const stepFillPercent = isCompleted ? 100 : Math.min(100, Math.max(0, ((currentIslandIndex - 1) / 4) * 100));

  return (
    <aside className="hud">
      {/* Brand & Island Status */}
      <section className="hud-panel hud-brand" style={{
        background: 'linear-gradient(135deg, rgba(12, 28, 48, 0.92) 0%, rgba(5, 12, 22, 0.98) 100%)',
        border: '1px solid rgba(198, 165, 106, 0.35)',
        borderRadius: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', margin: 0 }}>Project Ithaca</p>
          <span style={{ fontSize: '0.75rem', color: 'rgba(231, 229, 221, 0.6)' }}>Odyssey HUD</span>
        </div>
        <h2 className="hud-title" style={{ color: 'var(--cloud-white)', fontSize: '1.25rem', margin: '6px 0 2px 0' }}>
          {isCompleted ? 'Ithaca (Home)' : (currentIsland?.name || 'The Wine-Dark Sea')}
        </h2>
        <p className="hud-subtitle" style={{ color: 'rgba(198, 165, 106, 0.85)', fontSize: '0.82rem', marginBottom: '8px' }}>
          {isCompleted ? 'Odyssey Completed' : currentIsland ? `Island ${currentIsland.id} of 5` : 'Awaiting coordinates'}
        </p>

        {/* Voyage Progression Stepper */}
        <div className="hud-voyage-stepper">
          <div className="hud-voyage-track">
            <div className="hud-voyage-fill" style={{ width: `${stepFillPercent}%` }} />
          </div>
          {[1, 2, 3, 4, 5].map((step) => {
            const isStepCompleted = isCompleted || step < currentIslandIndex;
            const isStepActive = !isCompleted && step === currentIslandIndex;
            return (
              <div 
                key={step} 
                className={`hud-step-node ${isStepCompleted ? 'completed' : ''} ${isStepActive ? 'active' : ''}`}
                title={ISLANDS[step - 1]?.name || `Island ${step}`}
              >
                {isStepCompleted ? '✓' : step}
              </div>
            );
          })}
        </div>
      </section>

      {/* Years Remaining Counter */}
      <JourneyYears
        years={state?.team?.remaining_years}
        previousYears={previousYears}
        flashValue={flashValue}
      />

      {/* Crew Vessel & Oracle Hints */}
      <section className="hud-panel hud-card" style={{
        background: 'rgba(7, 21, 38, 0.8)',
        border: '1px solid rgba(198, 165, 106, 0.25)',
        borderRadius: '14px'
      }}>
        <div className="hud-meta">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Crew Vessel</p>
            <h3 style={{ margin: '4px 0 10px 0', fontSize: '1.05rem', color: 'var(--cloud-white)' }}>
              {teamName || 'Unnamed Crew'}
            </h3>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="action-button cinematic-button" 
              style={{ 
                padding: '4px 10px', 
                fontSize: '0.78rem', 
                border: '1px solid rgba(239, 68, 68, 0.5)', 
                color: '#f87171', 
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Abandon Ship
            </button>
          </div>
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Oracle Hints</p>
            <strong style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>
              {state?.team?.standard_hints_left ?? '--'}
            </strong>
          </div>
        </div>

        <div className="hud-meta" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(198, 165, 106, 0.12)' }}>
          <div>
            <p className="eyebrow">Voyage Status</p>
            <span style={{ 
              fontWeight: '600', 
              color: isCompleted ? 'var(--success)' : 'rgba(245, 242, 232, 0.9)' 
            }}>
              {isCompleted ? '🏆 Ithaca Reached' : '⛵ Under Sail'}
            </span>
          </div>
          <div>
            <p className="eyebrow">Hold Items</p>
            <span style={{ fontWeight: '600', color: 'var(--gold)' }}>
              {state?.inventory?.filter(i => !i.is_used).length ?? 0} active
            </span>
          </div>
        </div>
      </section>

      {/* Sacred Relics in Hold */}
      <section className="hud-panel hud-card" style={{
        background: 'rgba(7, 21, 38, 0.8)',
        border: '1px solid rgba(198, 165, 106, 0.25)',
        borderRadius: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', margin: 0 }}>Sacred Relics</p>
          <span style={{ fontSize: '0.75rem', color: 'rgba(231, 229, 221, 0.5)' }}>Hold</span>
        </div>
        <div className="inventory-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {state?.inventory?.length ? (
            state.inventory.map((item) => {
              const label = REWARD_LABELS[item.reward_type] || item.reward_type;
              const description = RELIC_DESCRIPTIONS[item.reward_type] || 'Sacred artifact bestowed upon your vessel.';
              return (
                <div key={item.id} className="tooltip-container" style={{ width: '100%' }}>
                  <div 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: item.is_used ? 'rgba(0, 0, 0, 0.3)' : 'rgba(198, 165, 106, 0.12)',
                      border: `1px solid ${item.is_used ? 'rgba(255, 255, 255, 0.08)' : 'rgba(198, 165, 106, 0.35)'}`,
                      opacity: item.is_used ? 0.45 : 1,
                      cursor: 'help'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: 'var(--cloud-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--gold)' }}><RelicIcon type={item.reward_type} /></span> {label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: item.is_used ? '#888' : 'var(--success)', fontWeight: 'bold' }}>
                      {item.is_used ? 'USED' : 'READY'}
                    </span>
                  </div>
                  <div className="tooltip-box">
                    {description}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="muted-copy" style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '4px 0' }}>
              No active artifacts in the hold.
            </p>
          )}
        </div>
      </section>

      {/* Abandon Ship Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-dialog">
            <h3 id="modal-title" style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: '0 0 10px 0' }}>
              Abandon Voyage?
            </h3>
            <p style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Are you sure you want to disembark? Your team's journey progress and scores remain securely saved on the database.
            </p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowLogoutConfirm(false)}
              >
                Stay Aboard
              </button>
              <button 
                type="button" 
                className="btn-confirm-danger" 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
              >
                Confirm Departure
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default GameHud;
