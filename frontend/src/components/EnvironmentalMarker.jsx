function EnvironmentalMarker({ islandSlug, state, onClick, label }) {
  // Determine icon based on island theme
  let icon = '✦';
  if (islandSlug === 'cyclops') icon = '👁';
  if (islandSlug === 'lotus') icon = '⚜';
  if (islandSlug === 'sirens') icon = '〰';
  if (islandSlug === 'witch') icon = '⚚';

  return (
    <div 
      className={`environmental-marker ${state}`} 
      onClick={state !== 'locked' ? onClick : undefined}
    >
      <div className="marker-icon">
        {state === 'completed' ? '✓' : state === 'locked' ? '🔒' : icon}
      </div>
      <div className="marker-content">
        <h4 style={{ margin: 0, fontFamily: 'var(--display)', color: 'var(--cloud-white)' }}>
          {label}
        </h4>
        <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'rgba(231,229,221,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {state}
        </p>
      </div>
    </div>
  );
}

export default EnvironmentalMarker;
