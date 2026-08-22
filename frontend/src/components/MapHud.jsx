import { useState } from 'react';
import JourneyYears from './JourneyYears.jsx';

function MapHud({ teamName, state, previousYears, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const currentIslandName = state?.team?.is_completed 
    ? 'Odyssey Complete (Ithaca)'
    : state?.team?.current_island 
    ? `Island ${state.team.current_island}` 
    : 'Awaiting route';
  const isFrozen = state?.is_frozen;

  return (
    <div className="map-hud-overlay">
      <div className="map-hud-top-left">
        <div className="map-hud-left-info">
          <p className="eyebrow" style={{ margin: 0 }}>Project Ithaca</p>
          <h2 className="map-hud-title" style={{ margin: '2px 0 0 0', fontSize: '1.25rem' }}>{currentIslandName}</h2>
        </div>
        <div className="map-hud-left-divider" />
        <div className="map-hud-left-years">
          <JourneyYears
            years={state?.team?.remaining_years}
            previousYears={previousYears}
          />
        </div>
      </div>

      <div className="map-hud-top-center">
        {isFrozen && (
          <div className="map-hud-frozen-pill">
            <span className="frozen-dot">●</span>
            <span>ODYSSEY CONCLUDED · SUBMISSIONS FROZEN</span>
          </div>
        )}
      </div>

      <div className="map-hud-top-right">
        <div className="map-hud-stats">
          <div className="stat-group">
            <span className="stat-label">Crew</span>
            <span className="stat-value">{teamName || 'Unnamed'}</span>
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
    </div>
  );
}

export default MapHud;
