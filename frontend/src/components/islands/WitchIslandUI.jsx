import React from 'react';

function WitchIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, hasBlessing, onBlessingClick, isPuzzleSolved = false }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const q1Completed = baseQuestions.find(q => q.sequence_number === 1)?.progress_status === 'CORRECT';

  return (
    <div className="trials-chamber witch-chamber-container">
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>🔮</span> Circe's Sanctum · Sequential Arcane Altars
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Trials Mastered
        </span>
      </div>

      {hasBlessing && (
        <div className="cyclops-artifact-banner witch-blessing-banner" style={{
          background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.12) 0%, rgba(20, 10, 30, 0.95) 50%, rgba(234, 179, 8, 0.12) 100%)',
          borderColor: 'rgba(234, 179, 8, 0.5)',
          margin: '0 auto 20px auto'
        }}>
          <div className="cyclops-artifact-info">
            <span style={{ fontSize: '1.8rem' }}>✨</span>
            <div>
              <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '0.95rem' }}>The Blessing of Troy Available</strong>
              <span style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.82rem' }}>
                Invoke divine talisman to protect your crew and deduct 3 years from your voyage.
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="cyclops-artifact-btn"
            onClick={onBlessingClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(198, 165, 106, 0.2)' }}
          >
            ⚡ Invoke Blessing (-3 Yrs)
          </button>
        </div>
      )}

      {/* Sequential Altar Cards Row */}
      <div className="witch-altars-row">
        {baseQuestions.map((q, index) => {
          const isSelected = q.id === activeMainQuestion?.id;
          const isCompleted = q.progress_status === 'CORRECT';
          const isFailed = q.progress_status === 'INCORRECT';
          
          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else if (index === 1) {
            isUnlocked = q1Completed && isPuzzleSolved;
          } else {
            isUnlocked = baseQuestions.slice(0, index).every(prev => prev.progress_status !== null);
          }

          let stateClass = '';
          if (!isUnlocked) {
            stateClass = 'locked';
          } else if (isCompleted) {
            stateClass = 'completed';
          } else if (isFailed) {
            stateClass = 'failed';
          } else if (isSelected) {
            stateClass = 'active';
          }

          return (
            <div 
              key={q.id}
              className={`witch-altar-card ${stateClass}`}
              onClick={() => {
                if (isUnlocked && onSelectQuestion) {
                  onSelectQuestion(q.id);
                }
              }}
              style={{
                opacity: !isUnlocked ? 0.45 : 1,
                cursor: !isUnlocked ? 'not-allowed' : 'pointer'
              }}
              title={!isUnlocked ? (index === 1 && !isPuzzleSolved ? 'Solve Decision Tree and 6x6 Sudoku to unlock' : 'Complete previous stage to unlock') : (index === 0 ? 'Trial 1: The Decision Tree' : 'Trial 2: Circe\'s Terminal')}
            >
              <div className="altar-icon">
                {!isUnlocked ? '🔒' : isCompleted ? '✓' : isFailed ? '✕' : (index === 0 ? '🌳' : '💻')}
              </div>
              <h4 className="altar-title">
                {index === 0 ? '1. Decision Tree' : '2. Terminal'}
              </h4>
              <span className="altar-reward-tag">
                {!isUnlocked ? 'Locked' : '-2.0y'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WitchIslandUI;

