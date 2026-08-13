import React, { useState } from 'react';

function WitchIslandUI({ onSelectQuestion, selectedId, hasSitOutPenalty }) {
  const [showPenalty, setShowPenalty] = useState(hasSitOutPenalty);
  
  const questions = [
    { id: 1, label: 'First Incantation' },
    { id: 2, label: 'Second Incantation' },
    { id: 3, label: 'Final Curse' },
  ];

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

      <div className="witch-structures">
        {questions.map((q) => (
          <div 
            key={q.id} 
            className={`witch-altar ${selectedId === q.id ? 'selected' : ''}`}
            onClick={() => onSelectQuestion(q.id)}
          >
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.2em' }}>
              {q.label}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WitchIslandUI;
