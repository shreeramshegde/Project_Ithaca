import { Link } from 'react-router-dom';

function IslandLandmark({ island, onClick }) {
  return (
    <div
      className={`island-landmark-container state-${island.state}`}
      style={{
        left: `${island.pos.x}%`,
        top: `${island.pos.y}%`,
      }}
      onClick={onClick}
      data-island-slug={island.slug}
    >
      <div className="island-landmark-hitbox">
        <img
          className="island-landmark-image"
          src={`/assets/islands/${island.slug}.jpg`}
          alt={island.name}
        />
        {island.state === 'completed' && <div className="island-landmark-seal" />}
        {island.state === 'locked' && <div className="island-landmark-lock" />}
      </div>
    </div>
  );
}

export default IslandLandmark;
