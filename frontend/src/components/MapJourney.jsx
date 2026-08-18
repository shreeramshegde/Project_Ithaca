import { Link } from 'react-router-dom';
import { ISLANDS } from '../data/islands.js';

function getStateForIsland(islandId, currentIsland) {
  if (!currentIsland) {
    return 'locked';
  }
  if (islandId < currentIsland) {
    return 'completed';
  }
  if (islandId === currentIsland) {
    return 'active';
  }
  return 'locked';
}

function MapJourney({ currentIsland }) {
  return (
    <section className="surface-panel map-panel">
      <div className="map-heading">
        <div>
          <p className="eyebrow">The Route to Ithaca</p>
          <h2 className="display-title">A Navigation Chart Across Open Water</h2>
        </div>
        <p className="map-summary">
          The current backend only exposes island progression at the team level, so this map reflects the real
          `current_island` state without inventing hidden unlock logic.
        </p>
      </div>

      <div className="map-track">
        {ISLANDS.map((island, index) => {
          const state = getStateForIsland(island.id, currentIsland);
          return (
            <div key={island.id} className={`map-stop ${state}`}>
              <div className="map-node">
                <span className="map-node-ring">{island.id}</span>
              </div>
              <div className="map-card">
                <p className="eyebrow">{state === 'completed' ? 'Conquered' : state === 'active' ? 'Current' : 'Locked'}</p>
                <h3>{island.name}</h3>
                <p>{island.blurb}</p>
                <Link
                  className={state === 'locked' ? 'ghost-button disabled-link' : 'secondary-button'}
                  to={state === 'locked' ? '/journey' : `/journey/${island.slug}`}
                  aria-disabled={state === 'locked'}
                  onClick={(event) => {
                    if (state === 'locked') {
                      event.preventDefault();
                    }
                  }}
                >
                  {state === 'active' ? 'Enter Island' : state === 'completed' ? 'Review Route' : 'Await Unlock'}
                </Link>
              </div>
              {index < ISLANDS.length - 1 ? <div className="map-line" /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MapJourney;
