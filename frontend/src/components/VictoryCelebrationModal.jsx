import React from 'react';

function VictoryCelebrationModal({ state, onClose, onNavigateIthaca }) {
  const team = state?.team;
  const remainingYears = team?.remaining_years ? Number(team.remaining_years).toFixed(2) : '10.00';

  return (
    <div className="modal-overlay victory-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="victory-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Decorative Golden Aura Glow */}
        <div className="victory-modal-glow" />

        <div className="victory-modal-badge">
          <span>🏛️</span>
          <span className="victory-badge-text">ODYSSEY MASTER · TRIUMPHANT RETURN</span>
        </div>

        <div className="victory-modal-hero">
          <div className="victory-laurel-icon">👑</div>
          <h2 className="victory-modal-title">
            HURRAY! YOU SOLVED THE MYSTERY!
          </h2>
          <p className="victory-modal-subtitle">
            Against impossible perils, your crew weathered treacherous storms, outwitted Polyphemus, resisted the Sirens' enchanting melodies, shattered Circe’s swine hex, and triumphantly reclaimed the golden shores of <strong>Ithaca</strong>!
          </p>
        </div>

        <div className="victory-stats-grid">
          <div className="victory-stat-card">
            <span className="vstat-label">Final Voyage Years</span>
            <span className="vstat-value gold">{remainingYears}y</span>
            <span className="vstat-caption">Years remaining</span>
          </div>

          <div className="victory-stat-card">
            <span className="vstat-label">Islands Conquered</span>
            <span className="vstat-value green">5 / 5</span>
            <span className="vstat-caption">All realms cleared</span>
          </div>

          <div className="victory-stat-card">
            <span className="vstat-label">Oracle Hints Left</span>
            <span className="vstat-value blue">{team?.standard_hints_left ?? 0}</span>
            <span className="vstat-caption">Divine counsel conserved</span>
          </div>
        </div>

        <div className="victory-lore-card">
          <span className="lore-icon">📜</span>
          <p>
            <em>"Sing in me, Muse, of that man of twists and turns, driven time and again off course, once he had plundered the hallowed heights of Troy..."</em>
            <br />
            <strong>Your name is now immortalized in the Annals of Ithaca.</strong>
          </p>
        </div>

        <div className="victory-actions-row">
          <button
            type="button"
            className="action-button cinematic-button victory-primary-btn"
            onClick={() => {
              onClose();
              if (onNavigateIthaca) onNavigateIthaca();
            }}
          >
            🏝️ Explore Golden Ithaca
          </button>
          <button
            type="button"
            className="secondary-button victory-close-btn"
            onClick={onClose}
          >
            Review Ocean Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default VictoryCelebrationModal;
