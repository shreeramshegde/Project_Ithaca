import { animateMapCamera, animateShipTravel } from '../animations/mapAnimations.js';
import { ISLANDS } from '../data/islands.js';
import IslandLandmark from './IslandLandmark.jsx';
import IslandTooltip from './IslandTooltip.jsx';
import JourneyPath from './JourneyPath.jsx';
import PlayerShip from './PlayerShip.jsx';

// Extended island metadata for positioning on the map (percentages of container)
const MAP_POSITIONS = {
  1: { x: 20, y: 80 }, // Lotus (Start)
  2: { x: 70, y: 65 }, // Cyclops
  3: { x: 30, y: 40 }, // Sirens
  4: { x: 75, y: 20 }, // Witch
  5: { x: 45, y: 5 },  // Ithaca
};

export function getStateForIsland(islandId, currentIsland) {
  if (!currentIsland) return 'locked';
  if (islandId < currentIsland) return 'completed';
  if (islandId === currentIsland) return 'active';
  return 'locked';
}

function OceanMap({ currentIsland, traveledFrom, onIslandClick }) {
  // Build the list of nodes for the path and rendering
  const nodes = ISLANDS.map((island) => ({
    ...island,
    pos: MAP_POSITIONS[island.id],
    state: getStateForIsland(island.id, currentIsland),
  }));

  return (
    <div className="ocean-map-container">
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
      <IslandTooltip />
    </div>
  );
}

export default OceanMap;
