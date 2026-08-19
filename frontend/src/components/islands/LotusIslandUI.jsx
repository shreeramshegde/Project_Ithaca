import React from 'react';

function LotusIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, totalFailedAttempts = 0 }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number >= 10);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);
  
  const allNodes = [...baseQuestions, ...unlockedPenaltyQuestions];

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>⚜</span> The Garden of Distortions · Inscriptions
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Cleared
          {totalFailedAttempts > 0 && ` · ${totalFailedAttempts} Penalty Active`}
        </span>
      </div>

      <div className="lotus-nodes-container">
        {allNodes.map((q, index) => {
          const isPenalty = q.sequence_number >= 10;
          const isSelected = q.id === activeMainQuestion?.id;
          const isCompleted = q.progress_status === 'CORRECT';
          const isFailed = q.progress_status === 'INCORRECT';

          let stateClass = '';
          if (isCompleted) stateClass = 'completed';
          else if (isFailed) stateClass = 'failed';
          else if (isSelected) stateClass = 'active';

          if (isPenalty) stateClass += ' penalty';

          return (
            <div 
              key={q.id} 
              className={`lotus-runic-node ${stateClass}`}
              onClick={() => onSelectQuestion(q.id)}
              title={isPenalty ? 'Redemption Inscription' : `Trial ${q.sequence_number || index + 1}`}
            >
              <div className="node-emblem" style={{
                color: isCompleted ? 'var(--success)' : isPenalty ? '#f87171' : isSelected ? 'var(--gold)' : 'rgba(198,165,106,0.6)'
              }}>
                {isCompleted ? '✓' : isPenalty ? '⚠' : (isSelected ? '⚜' : '◈')}
              </div>
              <span className="node-label">
                {isPenalty ? `P-${q.sequence_number - 9}` : `Trial ${q.sequence_number || index + 1}`}
              </span>
              <span className="node-reward-tag">
                {isPenalty ? '+2.0y' : '-0.5y'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LotusIslandUI;
