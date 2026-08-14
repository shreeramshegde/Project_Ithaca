import React from 'react';

function SirensIslandUI({ mainQuestions = [], activeMainQuestion }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  return (
    <div className="sirens-portals">
      {baseQuestions.map((q, index) => {
        let statusClass = '';
        if (q.status === 'CORRECT') statusClass = 'completed';
        else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
        else if (q.status === 'INCORRECT') statusClass = 'failed';

        return (
          <div 
            key={q.id} 
            className={`siren-portal ${statusClass}`}
          >
            <div className="portal-ring" style={{ borderColor: statusClass === 'completed' ? 'var(--success)' : '' }}></div>
            <span>Arch {index + 1} {statusClass === 'completed' && '✓'}</span>
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, letterSpacing: '0.15em' }}>
              {q.label}
            </h4>
          </div>
        );
      })}
    </div>
  );
}

export default SirensIslandUI;
