import React from 'react';

function WitchIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, hasSitOutPenalty }) {
  const baseQuestions = mainQuestions.filter((q) => q.sequence_number < 10);

  return (
    <div className="island-visual-container">
      <div className="island-visual-header">
        <span className="visual-icon">🧙‍♀️</span>
        <div>
          <h3>Circe's Gauntlet Altars</h3>
          <p className="visual-caption">Non-sequential: Face the sorceress's final 3 engineering puzzles before reaching Ithaca.</p>
        </div>
      </div>

      {hasSitOutPenalty && (
        <div className="witch-curse-alert-stripe">
          <span>⚠️</span>
          <div>
            <strong>Witch's Sit-Out Curse Active!</strong>
            <p>1 crewmate is sitting out this question. (Use <em>The Blessing</em> from inventory to bypass!)</p>
          </div>
        </div>
      )}

      <div className="witch-altars">
        {baseQuestions.map((q, index) => {
          const isActive = q.id === activeMainQuestion?.id;
          let statusClass = 'unattempted';
          let statusLabel = 'Altar Dormant';

          if (q.status === 'CORRECT') {
            statusClass = 'completed';
            statusLabel = 'Altar Purified (−2.0 yr)';
          } else if (q.status === 'INCORRECT') {
            statusClass = 'failed';
            statusLabel = 'Curse Triggered (+0.5 yr)';
          } else if (isActive) {
            statusClass = 'selected active';
            statusLabel = 'Under Trial';
          }

          return (
            <button
              key={q.id}
              type="button"
              className={`witch-altar ${statusClass}`}
              onClick={() => onSelectQuestion && !q.status && onSelectQuestion(q.id)}
              disabled={Boolean(q.status)}
            >
              <div className="altar-flame">
                <span className="flame-symbol">{q.status === 'CORRECT' ? '✓' : '🔥'}</span>
              </div>
              <h4>Altar {index + 1}</h4>
              <span className="altar-badge">High Difficulty</span>
              <span className="altar-status">{statusLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WitchIslandUI;
