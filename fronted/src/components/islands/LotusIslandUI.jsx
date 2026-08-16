import React from 'react';

function LotusIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, penaltyQuestions = [], activePenaltyIndex = 0 }) {
  const baseQuestions = mainQuestions.filter((q) => q.sequence_number < 10);
  const activePenalties = penaltyQuestions.slice(0, Math.min(activePenaltyIndex, penaltyQuestions.length));

  return (
    <div className="island-visual-container">
      <div className="island-visual-header">
        <span className="visual-icon">🌺</span>
        <div>
          <h3>Lotus Garden Trials</h3>
          <p className="visual-caption">Non-sequential: Click any trial flower to attempt in your preferred order.</p>
        </div>
      </div>

      <div className="lotus-grid">
        {baseQuestions.map((q, index) => {
          let statusClass = 'unattempted';
          let statusSymbol = '⚜';
          let statusText = 'Ready to Attempt';

          if (q.status === 'CORRECT') {
            statusClass = 'completed';
            statusSymbol = '✓';
            statusText = 'Solved (−0.5 yr)';
          } else if (q.status === 'INCORRECT') {
            statusClass = 'failed';
            statusSymbol = '✗';
            statusText = 'Mistake (+2.0 yr)';
          } else if (q.id === activeMainQuestion?.id) {
            statusClass = 'selected active';
            statusSymbol = '✦';
            statusText = 'Active Trial';
          }

          return (
            <button
              key={q.id}
              type="button"
              className={`lotus-marker ${statusClass}`}
              onClick={() => onSelectQuestion && !q.status && onSelectQuestion(q.id)}
              disabled={Boolean(q.status)}
              title={q.label}
            >
              <div className="lotus-glyph">{statusSymbol}</div>
              <div className="lotus-info">
                <h4>Trial {index + 1}</h4>
                <span className="marker-badge">{q.format}</span>
              </div>
              <span className="status-label">{statusText}</span>
            </button>
          );
        })}
      </div>

      {activePenalties.length > 0 && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#bc7865', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            ⚠️ Penalty Trials Triggered by Earlier Mistake ({activePenalties.filter((q) => Boolean(q.status)).length} / {activePenalties.length} Resolved)
          </p>
          <div className="lotus-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {activePenalties.map((pq, pIndex) => {
              let pClass = 'unattempted';
              let pSymbol = '⚠️';
              let pStatusText = 'Penalty Trial Required';

              if (pq.status === 'CORRECT') {
                pClass = 'completed';
                pSymbol = '✓';
                pStatusText = 'Cleared (−0.5 yr)';
              } else if (pq.status === 'INCORRECT') {
                pClass = 'failed';
                pSymbol = '✗';
                pStatusText = 'Penalty Mistake (+2.0 yr)';
              } else if (pq.id === activeMainQuestion?.id) {
                pClass = 'selected active';
                pSymbol = '✦';
                pStatusText = 'Active Penalty Trial';
              }

              return (
                <button
                  key={pq.id}
                  type="button"
                  className={`lotus-marker ${pClass}`}
                  style={{ borderColor: 'rgba(188, 120, 101, 0.6)' }}
                  onClick={() => onSelectQuestion && !pq.status && onSelectQuestion(pq.id)}
                  disabled={Boolean(pq.status)}
                  title={pq.label}
                >
                  <div className="lotus-glyph">{pSymbol}</div>
                  <div className="lotus-info">
                    <h4 style={{ color: '#bc7865' }}>Penalty {pIndex + 1}</h4>
                    <span className="marker-badge">{pq.format}</span>
                  </div>
                  <span className="status-label">{pStatusText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LotusIslandUI;
