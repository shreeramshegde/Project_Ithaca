import React from 'react';

function WitchIslandUI({ mainQuestions = [], activeMainQuestion, hasBlessing, onBlessingClick }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {hasBlessing && (
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="action-button cinematic-button" 
            onClick={onBlessingClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
          >
            Invoke The Blessing (Deduct 3 Years)
          </button>
        </div>
      )}
      <div className="witch-cauldrons" style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {baseQuestions.map((q, index) => {
          let statusClass = '';
          if (q.is_correct) statusClass = 'completed';
          else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
          else if (Number(q.incorrect_attempts || 0) > 0) statusClass = 'failed';

          return (
            <div 
              key={q.id} 
              className={`witch-cauldron ${statusClass}`}
              style={{
                width: '90px',
                height: '90px',
                border: `2px solid ${statusClass === 'completed' ? 'var(--success)' : statusClass === 'failed' ? 'var(--danger)' : statusClass === 'selected active' ? 'var(--gold)' : '#333'}`,
                borderRadius: '10px 10px 40px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: statusClass === 'selected active' ? 'rgba(198,165,106,0.1)' : 'rgba(0,0,0,0.4)',
                boxShadow: statusClass === 'selected active' ? '0 0 15px rgba(198,165,106,0.4)' : 'none',
                opacity: (statusClass === '' && index > 0 && !baseQuestions[index-1].is_correct) ? 0.3 : 1
              }}
            >
              <div style={{ color: statusClass === 'completed' ? 'var(--success)' : statusClass === 'failed' ? 'var(--danger)' : '#888', fontSize: '1.5rem', marginBottom: '5px' }}>
                {statusClass === 'completed' ? '✓' : statusClass === 'failed' ? '✕' : '✧'}
              </div>
              <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, fontSize: '0.8rem' }}>
                Spell {index + 1}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WitchIslandUI;
