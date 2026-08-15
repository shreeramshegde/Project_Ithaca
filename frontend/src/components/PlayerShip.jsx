function PlayerShip({ nodes, currentIsland }) {
  if (!currentIsland) return null;

  // Find the position of the current island
  const currentNode = nodes.find((n) => n.id === currentIsland);
  if (!currentNode) return null;

  const { x, y } = currentNode.pos;

  // The ship hovers slightly above/left of the island center
  return (
    <div
      className="player-ship-container"
      style={{
        left: `${x}%`,
        top: `${y}%`,
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
