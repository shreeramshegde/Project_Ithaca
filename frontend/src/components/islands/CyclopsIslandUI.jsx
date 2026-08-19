import React from 'react';

function CyclopsIslandUI({ mainQuestions = [], activeMainQuestion, hasCyclopsEye, onEyeClick, onSelectQuestion }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>👁</span> Polyphemus' Cave · Stepping Path
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
                Invoke to eliminate one treacherous wrong path on the current challenge.
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

          let stateClass = '';
          if (isCompleted) stateClass = 'completed';
          else if (isFailed) stateClass = 'failed';
          else if (isSelected) stateClass = 'active';

          return (
            <div 
              key={q.id} 
              className={`cyclops-runic-slab ${stateClass}`}
              onClick={() => onSelectQuestion && onSelectQuestion(q.id)}
            >
              <div style={{
                color: isCompleted ? 'var(--success)' : isFailed ? '#f87171' : isSelected ? 'var(--gold)' : '#888',
                fontSize: '1.5rem',
                marginBottom: '4px'
              }}>
                {isCompleted ? '✓' : isFailed ? '✕' : (isSelected ? '◈' : '•')}
              </div>
              <span style={{ fontFamily: 'var(--display)', fontSize: '0.88rem', color: 'var(--cloud-white)', fontWeight: 'bold' }}>
                Step {index + 1}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>
                -1.0y
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
