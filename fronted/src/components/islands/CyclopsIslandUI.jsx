import React, { useState } from 'react';

function CyclopsIslandUI({ onSelectQuestion, selectedId, hasCyclopsEye }) {
  const [eyeUsed, setEyeUsed] = useState(false);
  const questions = [
    { id: 1, label: 'Question 1' },
    { id: 2, label: 'Question 2' },
    { id: 3, label: 'Question 3' },
    { id: 4, label: 'Question 4' },
  ];

  const handleEyeClick = () => {
    setEyeUsed(true);
    // In a full implementation, this would trigger a backend call to eliminate an option
    // and visually cross it out on the QuestionConsole.
  };

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
        {questions.map((q) => (
          <div 
            key={q.id} 
            className={`cyclops-node ${selectedId === q.id ? 'selected' : ''}`}
            onClick={() => onSelectQuestion(q.id)}
          >
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.1em' }}>
              {q.label}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CyclopsIslandUI;
