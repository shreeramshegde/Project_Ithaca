import { useEffect, useState } from 'react';

function IslandTooltip() {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: '', state: '' });

  useEffect(() => {
    const handleMouseOver = (e) => {
      const landmark = e.target.closest('.island-landmark-container');
      if (landmark) {
        const rect = landmark.getBoundingClientRect();
        const img = landmark.querySelector('.island-landmark-image');
        const stateClass = Array.from(landmark.classList).find((c) => c.startsWith('state-'));
        const state = stateClass ? stateClass.replace('state-', '') : '';

        setTooltip({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top - 12,
          title: img ? img.alt : 'Island',
          state: state,
        });
      }
    };

    const handleMouseOut = (e) => {
      const landmark = e.target.closest('.island-landmark-container');
      if (landmark) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!tooltip.visible) return null;

  return (
    <div
      className="island-tooltip"
      style={{
        position: 'fixed',
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }}
    >
      <h4>{tooltip.title}</h4>
      <span className={`tooltip-state ${tooltip.state}`}>{tooltip.state.toUpperCase()}</span>
    </div>
  );
}

export default IslandTooltip;
