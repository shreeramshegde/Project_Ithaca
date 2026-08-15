import React from 'react';

function LotusIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, totalFailedAttempts = 0 }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number >= 10);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);
  
  const allNodes = [...baseQuestions, ...unlockedPenaltyQuestions];

  return (
    <div className="lotus-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {allNodes.map((q, index) => {
        let statusClass = '';
        if (q.is_correct) statusClass = 'completed';
        else if (q.id === activeMainQuestion?.id) statusClass = 'selected active';
        else if (q.incorrect_attempts > 0) statusClass = 'failed';

        const isPenalty = q.sequence_number >= 10;

        return (
          <div 
            key={q.id} 
            className={`lotus-marker ${statusClass}`}
            onClick={() => onSelectQuestion(q.id)}
            style={{
              cursor: 'pointer',
              border: isPenalty ? '2px dashed var(--danger)' : '2px solid var(--gold)',
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: statusClass === 'selected active' ? 'rgba(198, 165, 106, 0.2)' : 'rgba(7, 21, 38, 0.8)',
              transition: 'all 0.3s ease',
              boxShadow: statusClass === 'selected active' ? '0 0 15px var(--gold)' : 'none'
            }}
          >
            <div style={{ color: statusClass === 'completed' ? 'var(--success)' : (isPenalty ? 'var(--danger)' : '#c6a56a'), fontSize: '2rem', marginBottom: '5px' }}>
              {statusClass === 'completed' ? '✓' : (isPenalty ? '⚠' : '⚜')}
            </div>
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--cloud-white)', margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
              {isPenalty ? 'Penalty' : `Q${index + 1}`}
            </h4>
          </div>
        );
      })}
    </div>
  );
}

export default LotusIslandUI;
