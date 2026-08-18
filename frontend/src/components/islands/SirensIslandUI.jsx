import React from 'react';

function SirensIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, hasSandals, onSandalsClick }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {hasSandals && (
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="action-button cinematic-button" 
            onClick={onSandalsClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
          >
            Use Hermes' Sandals to Bypass Time (Deduct 2 Years)
          </button>
        </div>
      )}
      <div className="sirens-portals" style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {baseQuestions.map((q, index) => {
          let statusClass = '';
          if (q.is_correct) statusClass = 'completed';
          else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
          else if (Number(q.incorrect_attempts || 0) > 0) statusClass = 'failed';

          return (
            <div 
              key={q.id} 
              className={`siren-portal ${statusClass}`}
              onClick={() => onSelectQuestion(q.id)}
              style={{
                cursor: 'pointer',
                width: '100px',
                height: '140px',
                border: `2px solid ${statusClass === 'completed' ? 'var(--success)' : statusClass === 'selected active' ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '50px 50px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: statusClass === 'selected active' ? 'rgba(198,165,106,0.1)' : 'rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
                boxShadow: statusClass === 'selected active' ? '0 0 20px rgba(198,165,106,0.4)' : 'none'
              }}
            >
              <div className="portal-ring"></div>
              <span style={{ fontSize: '1.5rem', color: statusClass === 'completed' ? 'var(--success)' : statusClass === 'failed' ? 'var(--danger)' : '#fff' }}>
                {statusClass === 'completed' ? '✓' : statusClass === 'failed' ? '✕' : 'Ω'}
              </span>
              <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', marginTop: '10px', fontSize: '0.9rem' }}>
                Song {index + 1}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SirensIslandUI;
