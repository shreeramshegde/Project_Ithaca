function IslandLandmark({ island, onClick }) {
  const isClickable = island.state === 'active';

  return (
    <div
      className={`island-landmark-container state-${island.state} ${isClickable ? 'is-interactive' : ''}`}
      style={{
        left: `${island.pos.x}%`,
        top: `${island.pos.y}%`,
      }}
      onClick={onClick}
      data-island-slug={island.slug}
      role={isClickable ? 'button' : 'region'}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`${island.name} - ${island.state}`}
    >
      <div className="island-landmark-hitbox">
        {island.state === 'active' && <div className="island-active-pulse" />}
        <img
          className="island-landmark-image"
          src={`/assets/islands/${island.slug}.jpg`}
          alt={island.name}
        />
        {island.state === 'completed' && (
          <div className="island-landmark-seal" title="Trial Completed" />
        )}
        {island.state === 'locked' && (
          <div className="island-landmark-lock" title="Gateway Locked">
            <span className="lock-icon">🔒</span>
          </div>
        )}
        {island.state === 'active' && (
          <div className="island-landmark-active-badge">
            <span className="active-dot" />
            <span>NOW</span>
          </div>
        )}
      </div>

      <div className="island-landmark-badge">
        <div className="island-badge-header">
          <span className="island-badge-number">Island {island.id} of 5</span>
          <span className={`island-status-pill ${island.state}`}>
            {island.state === 'active' ? '● CURRENT' : island.state === 'completed' ? '✓ CLEARED' : 'LOCKED'}
          </span>
        </div>
        <h3 className="island-badge-name">{island.name}</h3>
        <p className="island-badge-title">{island.title}</p>
        {isClickable && (
          <div className="island-enter-prompt">
            <span>Enter Island</span>
            <span className="prompt-arrow">→</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default IslandLandmark;
