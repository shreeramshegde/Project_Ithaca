import React from 'react';
import JourneyYears from './JourneyYears.jsx';
import { ISLANDS } from '../data/islands.js';

function MapHud({ teamName, state, previousYears, onOpenRules }) {
  const currentIslandId = state?.team?.current_island || state?.current_island || 1;
  const currentIsland = ISLANDS.find((i) => i.id === currentIslandId);
  const remainingYears = state?.team?.remaining_years ?? state?.remaining_years ?? 20.0;
  const standardHints = state?.team?.standard_hints_left ?? state?.standard_hints_left ?? 3;
  const inventoryCount = state?.inventory?.length ?? 0;

  return (
    <div className="map-hud-overlay">
      <div className="map-hud-top-left">
        <div className="hud-brand-header">
          <span className="hud-gold-symbol">✦</span>
          <div>
            <p className="eyebrow">Project Ithaca &bull; NISB</p>
            <h2 className="map-hud-title">{currentIsland ? currentIsland.name : 'The Open Sea'}</h2>
          </div>
        </div>
      </div>

      <div className="map-hud-top-center">
        <JourneyYears
          years={remainingYears}
          previousYears={previousYears}
        />
      </div>

      <div className="map-hud-top-right">
        <div className="map-hud-stats">
          <div className="stat-group">
            <span className="stat-label">Crew</span>
            <span className="stat-value">{teamName || 'The Argonauts'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Hints</span>
            <span className="stat-value">{standardHints}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Artifacts</span>
            <span className="stat-value">{inventoryCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapHud;
