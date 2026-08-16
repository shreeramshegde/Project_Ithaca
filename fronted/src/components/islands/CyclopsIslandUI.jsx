import React from 'react';

function CyclopsIslandUI({ mainQuestions = [], activeMainQuestion, hasCyclopsEye, onUseCyclopsEye }) {
  const baseQuestions = mainQuestions.filter((q) => q.sequence_number < 10);

  return (
    <div className="island-visual-container">
      <div className="island-visual-header">
        <span className="visual-icon">👁️</span>
        <div>
          <h3>Cyclops Boulder Ascent</h3>
          <p className="visual-caption">Strictly Sequential: You must clear each stone barrier before climbing higher.</p>
        </div>
      </div>

      <div className="cyclops-path">
        {baseQuestions.map((q, index) => {
          const isActive = q.id === activeMainQuestion?.id;
          let statusClass = 'locked';
          let statusSymbol = '🔒';
          let statusLabel = 'Blocked by Boulder';

          if (q.status === 'CORRECT') {
            statusClass = 'completed';
            statusSymbol = '✓';
            statusLabel = 'Boulder Cleared (−1.0 yr)';
          } else if (q.status === 'INCORRECT') {
            statusClass = 'failed';
            statusSymbol = '✗';
            statusLabel = 'Retrying Barrier (+1.5 yr)';
          } else if (isActive) {
            statusClass = 'active selected';
            statusSymbol = '⚔️';
            statusLabel = 'Active Challenge';
          }

          return (
            <div key={q.id} className={`cyclops-stone ${statusClass}`}>
              <div className="stone-glyph">{statusSymbol}</div>
              <div className="stone-content">
                <h4>Step {index + 1}</h4>
                <span className="marker-badge">{q.format}</span>
              </div>
              <span className="stone-status">{statusLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
