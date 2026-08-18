import { useEffect, useRef, useState } from 'react';
import { animateShipTravel } from '../animations/mapAnimations.js';

function PlayerShip({ nodes, currentIsland, traveledFrom }) {
  const shipRef = useRef(null);
  
  // Decide where to initially mount the ship
  const initialIslandId = traveledFrom || currentIsland;
  const initialNode = nodes.find((n) => n.id === initialIslandId);
  const targetNode = nodes.find((n) => n.id === currentIsland);

  useEffect(() => {
    if (traveledFrom && traveledFrom !== currentIsland && targetNode) {
      // Trigger the GSAP animation to move the ship
      animateShipTravel(initialNode, targetNode, shipRef);
    }
  }, [traveledFrom, currentIsland, targetNode, initialNode]);

  if (!initialNode) return null;

  const { x, y } = initialNode.pos;

  return (
    <div
      ref={shipRef}
      className="player-ship-container"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        position: 'absolute',
      }}
    >
      <img
        className="player-ship-image"
        src="/assets/ship/odyssey-ship.jpg"
        alt="Odyssey Ship"
      />
    </div>
  );
}

export default PlayerShip;
