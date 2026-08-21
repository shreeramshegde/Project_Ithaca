function JourneyPath({ nodes }) {
  if (!nodes || nodes.length < 2) return null;

  // We construct an SVG path based on percentages.
  // The SVG itself will stretch 100% of the container.
  
  const generatePath = () => {
    let d = `M ${nodes[0].pos.x} ${nodes[0].pos.y}`;
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1].pos;
      const curr = nodes[i].pos;
      
      // Control points for a smooth winding bezier curve
      // Adjusting midpoints to create S-curves
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  return (
    <svg
      className="journey-path-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="path-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(198, 165, 106, 0.4)" />
          <stop offset="100%" stopColor="rgba(198, 165, 106, 0.1)" />
        </linearGradient>
      </defs>
      <path
        className="journey-path-track bg-track"
        d={generatePath()}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="journey-path-track current-track"
        d={generatePath()}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default JourneyPath;
