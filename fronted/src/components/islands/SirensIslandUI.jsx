import React from 'react';

function SirensIslandUI({ onSelectQuestion, selectedId }) {
  const questions = [
    { id: 1, label: 'Portal I' },
    { id: 2, label: 'Portal II' },
    { id: 3, label: 'Portal III' },
  ];

  return (
    <div className="sirens-portals">
      {questions.map((q) => (
        <div 
          key={q.id} 
          className={`sirens-portal ${selectedId === q.id ? 'selected' : ''}`}
          onClick={() => onSelectQuestion(q.id)}
        >
          <div style={{ color: 'rgba(231,229,221,0.5)', fontSize: '2.5rem', marginBottom: '20px' }}>〰</div>
          <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.15em' }}>
            {q.label}
          </h4>
        </div>
      ))}
    </div>
  );
}

export default SirensIslandUI;
