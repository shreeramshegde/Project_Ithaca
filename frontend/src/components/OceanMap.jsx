import { useEffect, useRef } from 'react';
import { animateMapCamera } from '../animations/mapAnimations.js';
import { ISLANDS } from '../data/islands.js';
import IslandLandmark from './IslandLandmark.jsx';
import IslandTooltip from './IslandTooltip.jsx';
import JourneyPath from './JourneyPath.jsx';
import PlayerShip from './PlayerShip.jsx';

// Extended island metadata for cinematic scrollable map
export const MAP_POSITIONS = {
  1: { x: 25, y: 88 }, // Lotus (Start / South)
  2: { x: 72, y: 68 }, // Cyclops
  3: { x: 28, y: 48 }, // Sirens
  4: { x: 74, y: 28 }, // Witch
  5: { x: 50, y: 9 },  // Ithaca (Destination / North)
};

export function getStateForIsland(islandId, currentIsland) {
  if (!currentIsland) return 'locked';
  if (islandId < currentIsland) return 'completed';
  if (islandId === currentIsland) return 'active';
  return 'locked';
}

function OceanMap({ currentIsland, traveledFrom, onIslandClick }) {
  const containerRef = useRef(null);

  // Build the list of nodes for the path and rendering
  const nodes = ISLANDS.map((island) => ({
    ...island,
    pos: MAP_POSITIONS[island.id],
    state: getStateForIsland(island.id, currentIsland),
  }));

  // Smoothly scroll to target island
  const scrollToIsland = (islandId, smooth = true) => {
    const pos = MAP_POSITIONS[islandId] || MAP_POSITIONS[1];
    const scrollContainer = document.querySelector('.journey-page-cinematic') || window;
    const mapWorld = containerRef.current?.querySelector('.ocean-map-world');

    if (mapWorld) {
      const mapHeight = mapWorld.offsetHeight || 1800;
      const targetScrollY = (pos.y / 100) * mapHeight - window.innerHeight / 2;

      if (typeof scrollContainer.scrollTo === 'function') {
        scrollContainer.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }
  };

  // Auto-scroll on initial load or island progression
  useEffect(() => {
    const activeIslandId = currentIsland || 1;
    const timer = setTimeout(() => {
      scrollToIsland(activeIslandId, true);
    }, 250);

    return () => clearTimeout(timer);
  }, [currentIsland]);

  return (
    <div className="ocean-map-container" ref={containerRef}>
      {/* Ambient Nautical Background Details */}
      <div className="ocean-grid-overlay" />
      
      {/* Decorative Compass Rose near Ithaca */}
      <div className="nautical-compass-rose">
        <svg viewBox="0 0 100 100" className="compass-svg" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(198, 165, 106, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(198, 165, 106, 0.15)" strokeWidth="1" />
          <polygon points="50,8 55,45 50,50 45,45" fill="#c6a56a" opacity="0.8" />
          <polygon points="50,92 55,55 50,50 45,55" fill="rgba(198, 165, 106, 0.4)" />
          <polygon points="8,50 45,45 50,50 45,55" fill="rgba(198, 165, 106, 0.4)" />
          <polygon points="92,50 55,45 50,50 55,55" fill="rgba(198, 165, 106, 0.4)" />
          <text x="50" y="5" textAnchor="middle" fill="#c6a56a" fontSize="7" fontFamily="Georgia, serif">N</text>
        </svg>
        <span className="compass-label">ITHACA WATERS</span>
      </div>

      <div className="ocean-map-world">
        <JourneyPath nodes={nodes} currentIsland={currentIsland} />

        {nodes.map((node) => (
          <IslandLandmark
            key={node.id}
            island={node}
            onClick={() => {
              if (node.state === 'active') {
                onIslandClick(node.slug);
              }
            }}
          />
        ))}

        <PlayerShip nodes={nodes} currentIsland={currentIsland} traveledFrom={traveledFrom} />
      </div>

      {/* Floating Side Voyage Navigator for quick vertical jumping */}
      <aside className="voyage-navigator" aria-label="Voyage Island Navigator">
        <div className="nav-header">
          <span className="nav-title">VOYAGE</span>
        </div>
        <div className="nav-nodes">
          {/* Display from top (Ithaca) to bottom (Lotus) */}
          {[...nodes].reverse().map((node) => (
            <button
              key={node.id}
              onClick={() => scrollToIsland(node.id)}
              className={`nav-node-btn state-${node.state} ${node.id === currentIsland ? 'is-active-btn' : ''}`}
              title={`Jump to ${node.name} (${node.state})`}
              aria-label={`Jump to ${node.name}`}
            >
              <span className="nav-node-index">{node.id}</span>
              <span className="nav-node-tooltip">{node.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Scroll indicator banner */}
      <div className="ocean-scroll-hint">
        <span className="scroll-arrow-icon">⇅</span>
        <span>Scroll / Slide to explore all 5 islands</span>
      </div>

      <IslandTooltip />
    </div>
  );
}

export default OceanMap;
