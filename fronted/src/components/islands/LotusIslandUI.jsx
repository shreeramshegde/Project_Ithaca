import React from 'react';

function LotusIslandUI({ mainQuestions = [], activeMainQuestion }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  return (
    <div className="lotus-grid">
      {baseQuestions.map((q, index) => {
        let statusClass = '';
        if (q.status === 'CORRECT') statusClass = 'completed';
        else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
        else if (q.status === 'INCORRECT') statusClass = 'failed';

        return (
          <div 
            key={q.id} 
            className={`lotus-marker ${statusClass}`}
          >
            <div style={{ color: statusClass === 'completed' ? 'var(--success)' : '#c6a56a', fontSize: '2rem', marginBottom: '10px' }}>
              {statusClass === 'completed' ? '✓' : '⚜'}
            </div>
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.1em' }}>
              Question {index + 1}
            </h4>
          </div>
        );
      })}
    </div>
  );
}

export default LotusIslandUI;
