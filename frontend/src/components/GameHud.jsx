import { ISLANDS, REWARD_LABELS } from '../data/islands.js';
import JourneyYears from './JourneyYears.jsx';

function GameHud({ teamName, state, previousYears, flashValue, onLogout }) {
  const currentIsland = ISLANDS.find((island) => island.id === state?.team?.current_island);

  return (
    <aside className="hud">
      <section className="hud-panel hud-brand">
        <p className="eyebrow">Project Ithaca</p>
        <h2 className="hud-title">The Tech Odyssey</h2>
        <p className="hud-subtitle">{currentIsland?.name || 'Awaiting route confirmation'}</p>
      </section>

      <JourneyYears
        years={state?.team?.remaining_years}
        previousYears={previousYears}
        flashValue={flashValue}
      />

      <section className="hud-panel hud-card">
        <div className="hud-meta">
          <div>
            <p className="eyebrow">Crew</p>
            <h3 style={{ marginBottom: '8px' }}>{teamName || 'Unnamed Crew'}</h3>
            <button 
              onClick={onLogout}
              className="action-button cinematic-button" 
              style={{ padding: '4px 8px', fontSize: '0.8rem', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent' }}
            >
              Abandon Ship
            </button>
          </div>
          <div>
            <p className="eyebrow">Hints</p>
            <strong>{state?.team?.standard_hints_left ?? '--'}</strong>
          </div>
        </div>
        <div className="hud-meta">
          <div>
            <p className="eyebrow">Status</p>
            <span>{state?.team?.is_completed ? 'Journey complete' : 'Still at sea'}</span>
          </div>
          <div>
            <p className="eyebrow">Inventory</p>
            <span>{state?.inventory?.length ?? 0} items</span>
          </div>
        </div>
      </section>

      <section className="hud-panel hud-card">
        <p className="eyebrow">Artifacts</p>
        <div className="inventory-list">
          {state?.inventory?.length ? (
            state.inventory.map((item) => (
              <span key={item.id} className="inventory-item">
                {REWARD_LABELS[item.reward_type] || item.reward_type}
              </span>
            ))
          ) : (
            <p className="muted-copy">No active artifacts in the hold.</p>
          )}
        </div>
      </section>

    </aside>
  );
}

export default GameHud;
