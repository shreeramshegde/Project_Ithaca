import React from 'react';

function SirensIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, hasSandals, onSandalsClick }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>🌊</span> Sirens' Straight · Harmonic Portals
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Melodies Decoded
        </span>
      </div>

      {hasSandals && (
        <div className="cyclops-artifact-banner" style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(7, 21, 38, 0.9) 50%, rgba(245, 158, 11, 0.1) 100%)',
          borderColor: 'rgba(245, 158, 11, 0.4)'
        }}>
          <div className="cyclops-artifact-info">
            <span style={{ fontSize: '1.8rem' }}>🪽</span>
            <div>
              <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '0.95rem' }}>Hermes' Winged Sandals Available</strong>
              <span style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.82rem' }}>
                Invoke to bypass the Sirens' time warp and instantly deduct 2 years from your voyage.
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="cyclops-artifact-btn"
            onClick={onSandalsClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(198, 165, 106, 0.15)' }}
          >
            ⚡ Don Sandals (-2 Yrs)
          </button>
        </div>
      )}

      <div className="sirens-portals-row">
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
              className={`sirens-portal-arch ${stateClass}`}
              onClick={() => onSelectQuestion && onSelectQuestion(q.id)}
            >
              <div style={{
                fontSize: '1.8rem',
                color: isCompleted ? 'var(--success)' : isFailed ? '#f87171' : isSelected ? '#60a5fa' : 'rgba(198,165,106,0.6)',
                marginBottom: '8px'
              }}>
                {isCompleted ? '✓' : isFailed ? '✕' : 'Ω'}
              </div>
              <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: '0 0 4px 0', fontSize: '0.92rem' }}>
                Song {index + 1}
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>
                -1.5y
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SirensIslandUI;
