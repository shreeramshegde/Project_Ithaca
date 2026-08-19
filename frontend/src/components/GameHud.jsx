import { ISLANDS, REWARD_LABELS } from '../data/islands.js';
import JourneyYears from './JourneyYears.jsx';

const ARTIFACT_ICONS = {
  ATHENAS_SCROLL: '📜',
  CYCLOPS_EYE: '👁',
  HERMES_SANDALS: '🪽',
  THE_BLESSING: '✨',
};

function GameHud({ teamName, state, previousYears, flashValue, onLogout }) {
  const currentIsland = ISLANDS.find((island) => island.id === state?.team?.current_island);

  return (
    <aside className="hud">
      <section className="hud-panel hud-brand" style={{
        background: 'linear-gradient(135deg, rgba(12, 28, 48, 0.9) 0%, rgba(5, 12, 22, 0.95) 100%)',
        border: '1px solid rgba(198, 165, 106, 0.3)',
        borderRadius: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', margin: 0 }}>Project Ithaca</p>
          <span style={{ fontSize: '0.75rem', color: 'rgba(231, 229, 221, 0.6)' }}>Odyssey HUD</span>
        </div>
        <h2 className="hud-title" style={{ color: 'var(--cloud-white)', fontSize: '1.3rem', margin: '6px 0 2px 0' }}>
          {currentIsland?.name || 'The Wine-Dark Sea'}
        </h2>
        <p className="hud-subtitle" style={{ color: 'rgba(198, 165, 106, 0.85)', fontSize: '0.85rem' }}>
          {currentIsland ? `Island ${currentIsland.id} of 5` : 'Awaiting coordinates'}
        </p>
      </section>

      <JourneyYears
        years={state?.team?.remaining_years}
        previousYears={previousYears}
        flashValue={flashValue}
      />

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
              onClick={onLogout}
              className="action-button cinematic-button" 
              style={{ 
                padding: '4px 10px', 
                fontSize: '0.78rem', 
                border: '1px solid rgba(239, 68, 68, 0.5)', 
                color: '#f87171', 
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px'
              }}
            >
              🚪 Abandon Ship
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
              color: state?.team?.is_completed ? 'var(--success)' : 'rgba(245, 242, 232, 0.9)' 
            }}>
              {state?.team?.is_completed ? '🏆 Ithaca Reached' : '⛵ Under Sail'}
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
              const icon = ARTIFACT_ICONS[item.reward_type] || '⚡';
              return (
                <div 
                  key={item.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: item.is_used ? 'rgba(0, 0, 0, 0.3)' : 'rgba(198, 165, 106, 0.12)',
                    border: `1px solid ${item.is_used ? 'rgba(255, 255, 255, 0.08)' : 'rgba(198, 165, 106, 0.35)'}`,
                    opacity: item.is_used ? 0.4 : 1
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--cloud-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{icon}</span> {REWARD_LABELS[item.reward_type] || item.reward_type}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: item.is_used ? '#888' : 'var(--success)', fontWeight: 'bold' }}>
                    {item.is_used ? 'USED' : 'READY'}
                  </span>
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
    </aside>
  );
}

export default GameHud;
