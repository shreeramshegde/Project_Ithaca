import React, { useEffect, useRef, useState } from 'react';
import { animateShipTravel } from '../animations/mapAnimations.js';

const DEFAULT_MAP_POSITIONS = {
  1: { x: 25, y: 89 }, // Lotus (Start / South)
  2: { x: 72, y: 71 }, // Cyclops
  3: { x: 28, y: 52 }, // Sirens
  4: { x: 74, y: 34 }, // Witch
  5: { x: 50, y: 16 }, // Ithaca (Destination / North)
};

/**
 * PlayerShip
 *
 * Renders the player's flagship (Odysseus' vessel) on the interactive ocean map:
 * - When progressing to a new island (voyage is provided), ALWAYS begins at the origin island
 *   and sails smoothly along the curved ocean path to the destination island.
 * - During sailing, displays an ocean wake and tilts into the turns.
 * - Upon docking at destination, triggers onVoyageArrival callback.
 */
function PlayerShip({ nodes = [], currentIsland = 1, voyage = null, onVoyageArrival = null }) {
  const shipRef = useRef(null);
  const voyageStartedRef = useRef(false);
  const [isSailing, setIsSailing] = useState(false);

  // Determine origin and destination nodes
  const fromId = voyage?.fromId || currentIsland || 1;
  const toId = voyage?.toId || currentIsland || 1;

  const fromNode = nodes.find((n) => n.id === fromId) || { pos: DEFAULT_MAP_POSITIONS[fromId] || DEFAULT_MAP_POSITIONS[1] };
  const toNode = nodes.find((n) => n.id === toId) || { pos: DEFAULT_MAP_POSITIONS[toId] || DEFAULT_MAP_POSITIONS[1] };

  // Starting position in React state
  const [currentPos, setCurrentPos] = useState(() => (voyage ? fromNode.pos : toNode.pos));

  useEffect(() => {
    if (voyage && voyage.fromId && voyage.toId && voyage.fromId !== voyage.toId) {
      if (voyageStartedRef.current) return;
      voyageStartedRef.current = true;

      setIsSailing(true);

      // Trigger GSAP travel along the exact S-curve journey path
      animateShipTravel(fromNode, toNode, shipRef, () => {
        setIsSailing(false);
        setCurrentPos(toNode.pos);
        if (typeof onVoyageArrival === 'function') {
          onVoyageArrival();
        }
      });
    } else {
      setCurrentPos(toNode.pos);
    }
  }, [voyage, fromNode, toNode, onVoyageArrival]);

  return (
    <div
      ref={shipRef}
      className={`player-ship-container ${isSailing ? 'is-sailing' : 'is-docked'}`}
      style={{
        left: `${currentPos.x}%`,
        top: `${currentPos.y}%`,
        position: 'absolute',
      }}
    >
      {/* Ship Ocean Wake Trail Effect when sailing */}
      {isSailing && <div className="ship-ocean-wake" />}

      {/* Main Ship Visual with Golden Aura */}
      <div className="player-ship-avatar">
        <img
          className="player-ship-image"
          src="/assets/ship/odyssey-ship.jpg"
          alt="Odyssey Ship"
        />
      </div>
      
      {/* Subtle Ship Nameplate */}
      <div className="player-ship-label">
        <span>ODYSSEUS</span>
      </div>
    </div>
  );
}

export default PlayerShip;
