import React from 'react';

function SirensIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion }) {
  const baseQuestions = mainQuestions.filter((q) => q.sequence_number < 10);

  return (
    <div className="island-visual-container">
      <div className="island-visual-header">
        <span className="visual-icon">🧜‍♀️</span>
        <div>
          <h3>Sirens' Sea Arches</h3>
          <p className="visual-caption">Non-sequential: Navigate through any of the 3 mystical sound portals.</p>
        </div>
      </div>

      <div className="sirens-portals">
        {baseQuestions.map((q, index) => {
          const isActive = q.id === activeMainQuestion?.id;
          let statusClass = 'unattempted';
          let statusLabel = 'Awaiting Passage';

          if (q.status === 'CORRECT') {
            statusClass = 'completed';
            statusLabel = 'Arch Conquered (−1.5 yr)';
          } else if (q.status === 'INCORRECT') {
            statusClass = 'failed';
            statusLabel = 'Deceived by Siren (+1.0 yr)';
          } else if (isActive) {
            statusClass = 'selected active';
            statusLabel = 'Transmitting Answer';
          }

          return (
            <button
              key={q.id}
              type="button"
              className={`siren-portal ${statusClass}`}
              onClick={() => onSelectQuestion && !q.status && onSelectQuestion(q.id)}
              disabled={Boolean(q.status)}
            >
              <div className="portal-ring">
                <span className="portal-glyph">{q.status === 'CORRECT' ? '✓' : '🌊'}</span>
              </div>
              <h4>Arch {index + 1}</h4>
              <span className="portal-badge">Non-MCQ</span>
              <span className="portal-status">{statusLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SirensIslandUI;
