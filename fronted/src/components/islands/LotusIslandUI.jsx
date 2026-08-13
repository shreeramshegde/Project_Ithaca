import React from 'react';

function LotusIslandUI({ onSelectQuestion, selectedId }) {
  const questions = [
    { id: 1, label: 'Question I' },
    { id: 2, label: 'Question II' },
    { id: 3, label: 'Question III' },
    { id: 4, label: 'Question IV' },
  ];

  return (
    <div className="lotus-grid">
      {questions.map((q) => (
        <div 
          key={q.id} 
          className={`lotus-marker ${selectedId === q.id ? 'selected' : ''}`}
          onClick={() => onSelectQuestion(q.id)}
        >
          <div style={{ color: '#c6a56a', fontSize: '2rem', marginBottom: '10px' }}>⚜</div>
          <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.1em' }}>
            {q.label}
          </h4>
        </div>
      ))}
    </div>
  );
}

export default LotusIslandUI;
