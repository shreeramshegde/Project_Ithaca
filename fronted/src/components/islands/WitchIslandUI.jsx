import React, { useState } from 'react';

function WitchIslandUI({ mainQuestions = [], onSelectQuestion, selectedId, hasSitOutPenalty }) {
  const [showPenalty, setShowPenalty] = useState(hasSitOutPenalty);
  
  return (
    <div>
      {showPenalty && (
        <div className="witch-penalty-modal">
          <div className="witch-penalty-content">
            <h2 style={{ fontFamily: 'var(--display)', color: '#8c2a2a', fontSize: '2rem', marginBottom: '10px' }}>
              THE CURSE HAS TAKEN HOLD
            </h2>
            <p style={{ color: 'var(--cloud-white)', fontSize: '1.1rem', marginBottom: '30px' }}>
              A crewmate must sit out the next trial.
            </p>
            <button 
              className="action-button cinematic-button" 
              style={{ width: '100%', borderColor: '#8c2a2a' }}
              onClick={() => setShowPenalty(false)}
            >
              Accept Fate
            </button>
          </div>
        </div>
      )}

      <div className="witch-altars">
        {mainQuestions.filter(q => q.sequence_number < 10).map((q, index) => {
          let statusClass = '';
          if (q.status === 'CORRECT') statusClass = 'completed';
          else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
          else if (q.status === 'INCORRECT') statusClass = 'failed';

          return (
            <div 
              key={q.id} 
              className={`witch-altar ${statusClass}`}
            >
              <div className="altar-flame" style={{ backgroundColor: statusClass === 'completed' ? 'var(--success)' : '' }}></div>
              <span>Altar {index + 1} {statusClass === 'completed' && '✓'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WitchIslandUI;
