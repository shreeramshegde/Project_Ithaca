import React, { useEffect, useRef, useState } from 'react';
import { ISLANDS } from '../data/islands.js';
import IslandLandmark from './IslandLandmark.jsx';
import IslandTooltip from './IslandTooltip.jsx';
import JourneyPath from './JourneyPath.jsx';
import PlayerShip from './PlayerShip.jsx';

// Island coordinates for cinematic scrollable map
export const MAP_POSITIONS = {
  1: { x: 25, y: 89 }, // Lotus (Start / South)
  2: { x: 72, y: 71 }, // Cyclops
  3: { x: 28, y: 52 }, // Sirens
  4: { x: 74, y: 34 }, // Witch
  5: { x: 50, y: 16 }, // Ithaca (Destination / North)
};

export function getStateForIsland(islandId, activeIsland) {
  if (!activeIsland) return 'locked';
  if (islandId < activeIsland) return 'completed';
  if (islandId === activeIsland) return 'active';
  return 'locked';
}

function OceanMap({ currentIsland, voyage = null, onVoyageArrival = null, onIslandClick }) {
  const containerRef = useRef(null);

  // During voyage, keep origin island active until arrival
  const [displayedActiveIsland, setDisplayedActiveIsland] = useState(() => {
    if (voyage && voyage.fromId) {
      return voyage.fromId;
    }
    return currentIsland || 1;
  });

  const handleArrival = () => {
    if (voyage?.toId) {
      setDisplayedActiveIsland(voyage.toId);
    }
    if (typeof onVoyageArrival === 'function') {
      onVoyageArrival();
    }
  };

  // Build the list of nodes for the path and rendering
  const nodes = ISLANDS.map((island) => ({
    ...island,
    pos: MAP_POSITIONS[island.id],
    state: getStateForIsland(island.id, displayedActiveIsland),
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

  // Initial camera setup
  useEffect(() => {
    if (voyage && voyage.fromId) {
      // Instantly frame the departure island so player sees their boat at origin
      scrollToIsland(voyage.fromId, false);
    } else {
      const activeId = currentIsland || 1;
      const timer = setTimeout(() => {
        scrollToIsland(activeId, true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [voyage, currentIsland]);

  return (
    <div className="ocean-map-container" ref={containerRef}>
      {/* Celestial Northern Sea Sky Banner above Ithaca */}
      <div className="ocean-celestial-banner" />

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
        <JourneyPath nodes={nodes} currentIsland={displayedActiveIsland} />

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

        <PlayerShip
          nodes={nodes}
          currentIsland={currentIsland}
          voyage={voyage}
          onVoyageArrival={handleArrival}
        />
      </div>

      {/* Floating Side Voyage Navigator for quick vertical jumping */}
      <aside className="voyage-navigator" aria-label="Voyage Island Navigator">
        <div className="nav-header">
          <span className="nav-title">VOYAGE</span>
        </div>
        <div className="nav-nodes">
          {[...nodes].reverse().map((node) => (
            <button
              key={node.id}
              onClick={() => scrollToIsland(node.id)}
              className={`nav-node-btn state-${node.state} ${node.id === displayedActiveIsland ? 'is-active-btn' : ''}`}
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
