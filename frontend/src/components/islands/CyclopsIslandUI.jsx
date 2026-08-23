import React from 'react';

function CyclopsIslandUI({ mainQuestions = [], activeMainQuestion, hasCyclopsEye, onEyeClick, onSelectQuestion }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>👁</span> Polyphemus' Cave · Sequential Stepping Path
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Steps Conquered
        </span>
      </div>

      {hasCyclopsEye && (
        <div className="cyclops-artifact-banner">
          <div className="cyclops-artifact-info">
            <span style={{ fontSize: '1.8rem' }}>👁</span>
            <div>
              <strong style={{ color: '#00f0ff', display: 'block', fontSize: '0.95rem' }}>Cyclops' Eye Active in Inventory</strong>
              <span style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.82rem' }}>
                Invoke to pierce through the darkness and reduce the Island 2 penalty burden by half (-0.375 yrs).
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="cyclops-artifact-btn" 
            onClick={onEyeClick}
          >
            ⚡ Invoke Eye
          </button>
        </div>
      )}

      <div className="cyclops-stepping-row">
        {baseQuestions.map((q, index) => {
          const isSelected = q.id === activeMainQuestion?.id;
          const isCompleted = q.progress_status === 'CORRECT';
          const isFailed = q.progress_status === 'INCORRECT';
          const isUnlocked = index === 0 || baseQuestions.slice(0, index).every(prev => prev.progress_status !== null);

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
              className={`cyclops-runic-slab ${stateClass}`}
              onClick={() => {
                if (isUnlocked && onSelectQuestion) {
                  onSelectQuestion(q.id);
                }
              }}
              style={{
                opacity: !isUnlocked ? 0.42 : 1,
                cursor: !isUnlocked ? 'not-allowed' : 'pointer',
                borderColor: !isUnlocked ? 'rgba(255, 255, 255, 0.1)' : undefined
              }}
              title={!isUnlocked ? 'Complete previous steps sequentially to unlock' : `Step ${index + 1}`}
            >
              <div style={{
                color: !isUnlocked ? '#666' : isCompleted ? 'var(--success)' : isFailed ? '#f87171' : isSelected ? 'var(--gold)' : '#888',
                fontSize: '1.5rem',
                marginBottom: '4px'
              }}>
                {!isUnlocked ? '🔒' : isCompleted ? '✓' : isFailed ? '✕' : (isSelected ? '◈' : '•')}
              </div>
              <span style={{ fontFamily: 'var(--display)', fontSize: '0.88rem', color: !isUnlocked ? 'rgba(231,229,221,0.5)' : 'var(--cloud-white)', fontWeight: 'bold' }}>
                Step {index + 1}
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                color: !isUnlocked ? '#555' : isCompleted ? 'var(--success)' : isFailed ? '#f87171' : 'var(--gold)',
                fontWeight: isCompleted || isFailed ? 'bold' : 'normal'
              }}>
                {!isUnlocked 
                  ? 'Locked' 
                  : isCompleted 
                    ? `-${q.reward_years || 0.5}y` 
                    : isFailed 
                      ? `+${q.penalty_years || 0.75}y` 
                      : `-${q.reward_years || 0.5}y`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
