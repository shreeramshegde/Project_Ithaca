import React, { useState } from 'react';

function CyclopsIslandUI({ mainQuestions = [], activeMainQuestion, hasCyclopsEye }) {
  const [eyeUsed, setEyeUsed] = useState(false);
  
  const handleEyeClick = () => {
    setEyeUsed(true);
  };

  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);

  return (
    <div>
      {hasCyclopsEye && (
        <div className="cyclops-eye-action">
          <button 
            className={`cyclops-eye-btn ${eyeUsed ? 'active' : ''}`} 
            onClick={handleEyeClick}
            disabled={eyeUsed}
          >
            {eyeUsed ? 'Eye of the Cyclops Used' : 'Use Cyclops Eye'}
          </button>
        </div>
      )}

      <div className="cyclops-path">
        {baseQuestions.map((q, index) => {
          let statusClass = '';
          if (q.status === 'CORRECT') statusClass = 'completed';
          else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
          else if (q.status === 'INCORRECT') statusClass = 'failed';

          return (
            <div 
              key={q.id} 
              className={`cyclops-stone ${statusClass}`}
            >
              {hasCyclopsEye ? (
                <div style={{ color: '#00f0ff', fontSize: '1.5rem', marginBottom: '5px' }}>👁</div>
              ) : (
                <div style={{ color: statusClass === 'completed' ? 'var(--success)' : '#888', fontSize: '1.5rem', marginBottom: '5px' }}>
                  {statusClass === 'completed' ? '✓' : '•'}
                </div>
              )}
              <span>Step {index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
