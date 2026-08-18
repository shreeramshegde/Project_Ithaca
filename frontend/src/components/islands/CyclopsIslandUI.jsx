import React, { useState } from 'react';

function CyclopsIslandUI({ mainQuestions = [], activeMainQuestion, hasCyclopsEye, totalFailedAttempts = 0 }) {
  const [eyeUsed, setEyeUsed] = useState(false);
  
  const handleEyeClick = () => {
    setEyeUsed(true);
  };

  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number >= 10);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);
  
  const allNodes = [...baseQuestions, ...unlockedPenaltyQuestions];

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {hasCyclopsEye && (
        <div className="cyclops-eye-action" style={{ marginBottom: '2rem' }}>
          <button 
            className={`action-button cinematic-button ${eyeUsed ? 'completed' : ''}`} 
            onClick={handleEyeClick}
            disabled={eyeUsed}
            style={{ 
              borderColor: eyeUsed ? 'var(--success)' : '#00f0ff', 
              color: eyeUsed ? 'var(--success)' : '#00f0ff' 
            }}
          >
            {eyeUsed ? 'Eye of the Cyclops Used' : 'Use Cyclops Eye to Reveal Path'}
          </button>
        </div>
      )}

      <div className="cyclops-path" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px',
        alignItems: 'center'
      }}>
        {allNodes.map((q, index) => {
          let statusClass = '';
          if (q.is_correct) statusClass = 'completed';
          else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
          else if (Number(q.incorrect_attempts || 0) > 0) statusClass = 'failed';

          const isPenalty = q.sequence_number >= 10;

          return (
            <div 
              key={q.id} 
              className={`cyclops-stone ${statusClass}`}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                border: isPenalty ? '2px dashed var(--danger)' : `2px solid ${statusClass === 'completed' ? 'var(--success)' : statusClass === 'failed' ? 'var(--danger)' : statusClass === 'selected active' ? 'var(--gold)' : '#333'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: statusClass === 'selected active' ? 'rgba(198,165,106,0.1)' : 'rgba(0,0,0,0.4)',
                boxShadow: statusClass === 'selected active' ? '0 0 15px rgba(198,165,106,0.4)' : 'none',
                opacity: (statusClass === '' && !hasCyclopsEye && index > 0 && !allNodes[index-1].is_correct) ? 0.3 : 1
              }}
            >
              {hasCyclopsEye && !q.is_correct && statusClass !== 'failed' ? (
                <div style={{ color: '#00f0ff', fontSize: '1.5rem', marginBottom: '5px' }}>👁</div>
              ) : (
                <div style={{ color: statusClass === 'completed' ? 'var(--success)' : statusClass === 'failed' ? 'var(--danger)' : '#888', fontSize: '1.5rem', marginBottom: '5px' }}>
                  {statusClass === 'completed' ? '✓' : statusClass === 'failed' ? '✕' : '•'}
                </div>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--cloud)', fontWeight: 'bold' }}>
                {isPenalty ? 'Penalty' : `Step ${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
