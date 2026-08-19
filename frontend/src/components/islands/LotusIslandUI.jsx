import React from 'react';

function LotusIslandUI({ 
  mainQuestions = [], 
  activeMainQuestion, 
  onSelectQuestion, 
  totalFailedAttempts = 0,
  hasAthenasScroll = false,
  onScrollClick
}) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number <= 4);
  const penaltyQuestions = mainQuestions.filter(q => q.sequence_number > 4);
  const unlockedPenaltyQuestions = penaltyQuestions.slice(0, totalFailedAttempts);
  
  const allNodes = [...baseQuestions, ...unlockedPenaltyQuestions];

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>⚜</span> The Garden of Distortions · 4 Inscriptions
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Cleared
          {totalFailedAttempts > 0 && ` · ${totalFailedAttempts} Penalty Inscription${totalFailedAttempts > 1 ? 's' : ''} Active`}
        </span>
      </div>

      {hasAthenasScroll && (
        <div className="cyclops-artifact-banner" style={{
          background: 'linear-gradient(90deg, rgba(198, 165, 106, 0.14) 0%, rgba(7, 21, 38, 0.92) 50%, rgba(198, 165, 106, 0.14) 100%)',
          borderColor: 'rgba(198, 165, 106, 0.45)',
          marginBottom: '20px'
        }}>
          <div className="cyclops-artifact-info">
            <span style={{ fontSize: '1.8rem' }}>📜</span>
            <div>
              <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '0.95rem' }}>Athena's Scroll Active in Inventory</strong>
              <span style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.82rem' }}>
                Invoke Athena's wisdom to reveal an illuminating Oracle hint on your active trial without spending standard hints.
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="cyclops-artifact-btn"
            onClick={onScrollClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(198, 165, 106, 0.18)' }}
          >
            ⚡ Invoke Scroll
          </button>
        </div>
      )}

      <div className="lotus-nodes-container">
        {allNodes.map((q, index) => {
          const isPenalty = q.sequence_number > 4;
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
              title={isPenalty ? `Penalty Inscription ${q.sequence_number - 4}` : `Trial ${q.sequence_number || index + 1}`}
            >
              <div className="node-emblem" style={{
                color: isCompleted ? 'var(--success)' : isPenalty ? '#f87171' : isSelected ? 'var(--gold)' : 'rgba(198,165,106,0.6)'
              }}>
                {isCompleted ? '✓' : isPenalty ? '⚠' : (isSelected ? '⚜' : '◈')}
              </div>
              <span className="node-label">
                {isPenalty ? `Penalty ${q.sequence_number - 4}` : `Trial ${q.sequence_number || index + 1}`}
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
