import { useState } from 'react';
import JourneyYears from './JourneyYears.jsx';

function MapHud({ teamName, state, previousYears, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const currentIslandName = state?.team?.is_completed 
    ? 'Odyssey Complete (Ithaca)'
    : state?.team?.current_island 
    ? `Island ${state.team.current_island}` 
    : 'Awaiting route';

  return (
    <div className="map-hud-overlay">
      <div className="map-hud-top-left">
        <p className="eyebrow">Project Ithaca</p>
        <h2 className="map-hud-title">{currentIslandName}</h2>
      </div>

      <div className="map-hud-top-center">
        <JourneyYears
          years={state?.team?.remaining_years}
          previousYears={previousYears}
        />
      </div>

      <div className="map-hud-top-right">
        <div className="map-hud-stats">
          <div className="stat-group">
            <span className="stat-label">Crew</span>
            <span className="stat-value" style={{ marginBottom: '4px' }}>{teamName || 'Unnamed'}</span>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="action-button cinematic-button" 
              style={{ 
                padding: '3px 8px', 
                fontSize: '0.72rem', 
                border: '1px solid rgba(239, 68, 68, 0.5)', 
                color: '#f87171', 
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Abandon Ship
            </button>
          </div>
          <div className="stat-group">
            <span className="stat-label">Oracle Hints</span>
            <span className="stat-value">{state?.team?.standard_hints_left ?? '--'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Active Items</span>
            <span className="stat-value">{state?.inventory?.filter(i => !i.is_used).length ?? 0}</span>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <h3 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: '0 0 10px 0' }}>
              Abandon Voyage?
            </h3>
            <p style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Are you sure you want to disembark? Your team's progress is securely saved.
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
    </div>
  );
}

export default MapHud;
