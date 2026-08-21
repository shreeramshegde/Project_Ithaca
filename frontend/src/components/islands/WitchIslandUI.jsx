import React from 'react';
import RunicSudoku from '../games/RunicSudoku.jsx';

function WitchIslandUI({ mainQuestions = [], activeMainQuestion, onSelectQuestion, hasBlessing, onBlessingClick, isPuzzleSolved = false, onSolvePuzzle }) {
  const baseQuestions = mainQuestions.filter(q => q.sequence_number < 10);
  const q1Completed = baseQuestions.find(q => q.sequence_number === 1)?.progress_status === 'CORRECT';

  return (
    <div className="trials-chamber" style={{ width: '100%' }}>
      <div className="trials-chamber-header">
        <h4 className="trials-chamber-title">
          <span>🔮</span> Circe's Sanctum · Sequential Arcane Altars
        </h4>
        <span className="trials-stats-badge">
          {baseQuestions.filter(q => q.progress_status === 'CORRECT').length} of {baseQuestions.length} Trials Mastered
        </span>
      </div>

      {/* Storyline: After Q1 (Decision Tree) is solved, show 6x6 Sudoku to transform crew from beasts to humans before Terminal opens */}
      {q1Completed && !isPuzzleSolved && (
        <div style={{ margin: '16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(7, 21, 38, 0.95) 100%)',
            border: '1.5px solid #a855f7',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#c084fc', margin: '0 0 6px 0', fontFamily: 'var(--display)', fontSize: '1.15rem' }}>
              ✦ THE WITCH'S TRANSMUTATION WARD ✦
            </h4>
            <p style={{ color: 'rgba(245, 242, 232, 0.9)', fontSize: '0.92rem', margin: 0, lineHeight: '1.5' }}>
              Your fleet has navigated the safe waters, but Odysseus's crew remains bewitched as swine! Solve Circe's 6x6 Runic Matrix below to brew the counter-potion and restore your crew to human form before accessing the Archive Terminal.
            </p>
          </div>
          <RunicSudoku onSolve={onSolvePuzzle} isSolved={isPuzzleSolved} />
        </div>
      )}

      {hasBlessing && (
        <div className="cyclops-artifact-banner" style={{
          background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.1) 0%, rgba(7, 21, 38, 0.9) 50%, rgba(234, 179, 8, 0.1) 100%)',
          borderColor: 'rgba(234, 179, 8, 0.45)'
        }}>
          <div className="cyclops-artifact-info">
            <span style={{ fontSize: '1.8rem' }}>✨</span>
            <div>
              <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '0.95rem' }}>The Blessing of Troy Available</strong>
              <span style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.82rem' }}>
                Invoke the divine talisman to protect your crew and deduct 3 years from your journey.
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="cyclops-artifact-btn"
            onClick={onBlessingClick}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(198, 165, 106, 0.15)' }}
          >
            ⚡ Invoke Blessing (-3 Yrs)
          </button>
        </div>
      )}

      <div className="witch-altars-row">
        {baseQuestions.map((q, index) => {
          const isSelected = q.id === activeMainQuestion?.id;
          const isCompleted = q.progress_status === 'CORRECT';
          const isFailed = q.progress_status === 'INCORRECT';
          
          // Question 2 (Terminal) is locked until Q1 is correct AND 6x6 Sudoku is solved!
          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else if (index === 1) {
            isUnlocked = q1Completed && isPuzzleSolved;
          } else {
            isUnlocked = baseQuestions.slice(0, index).every(prev => prev.progress_status !== null);
          }

          let stateClass = '';
          if (!isUnlocked) {
            stateClass = 'locked';
          } else if (isCompleted) {
            stateClass = 'completed';
          } else if (isFailed) {
            stateClass = 'failed';
          } else if (isSelected) {
            stateClass = 'active';
          }

          return (
            <div 
              key={q.id}
              className={`witch-altar-card ${stateClass}`}
              onClick={() => {
                if (isUnlocked && onSelectQuestion) {
                  onSelectQuestion(q.id);
                }
              }}
              style={{
                opacity: !isUnlocked ? 0.4 : 1,
                cursor: !isUnlocked ? 'not-allowed' : 'pointer',
                borderColor: !isUnlocked ? 'rgba(255, 255, 255, 0.1)' : undefined,
                borderTopColor: !isUnlocked ? '#444' : undefined
              }}
              title={!isUnlocked ? (index === 1 && !isPuzzleSolved ? 'Solve Decision Tree and 6x6 Sudoku to unlock' : 'Complete previous stage to unlock') : (index === 0 ? 'Trial 1: The Decision Tree' : 'Trial 2: Circe\'s Terminal')}
            >
              <div style={{
                fontSize: '1.6rem',
                color: !isUnlocked ? '#666' : isCompleted ? 'var(--success)' : isFailed ? '#f87171' : isSelected ? '#f59e0b' : 'rgba(198,165,106,0.6)',
                marginBottom: '4px'
              }}>
                {!isUnlocked ? '🔒' : isCompleted ? '✓' : isFailed ? '✕' : (index === 0 ? '🌳' : '💻')}
              </div>
              <h4 style={{ fontFamily: 'var(--display)', color: !isUnlocked ? 'rgba(231,229,221,0.5)' : 'var(--cloud-white)', margin: '0 0 2px 0', fontSize: '0.88rem' }}>
                {index === 0 ? '1. Decision Tree' : '2. Terminal'}
              </h4>
              <span style={{ fontSize: '0.7rem', color: !isUnlocked ? '#555' : 'var(--gold)' }}>
                {!isUnlocked ? 'Locked' : '-2.0y'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WitchIslandUI;
