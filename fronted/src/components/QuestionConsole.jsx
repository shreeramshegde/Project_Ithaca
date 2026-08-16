import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function QuestionConsole({
  island,
  loading,
  isCompleted,
  onNextIsland,
  preRoundQuestion,
  mainQuestion,
  onSubmitPreRound,
  onSubmitAnswer,
  eliminatedOptions = {},
  onUseCyclopsEye,
  hasCyclopsEye = false,
}) {
  const [preRoundAnswer, setPreRoundAnswer] = useState('');
  const [mainAnswer, setMainAnswer] = useState('');

  useEffect(() => {
    setPreRoundAnswer('');
    setMainAnswer('');
  }, [preRoundQuestion?.id, mainQuestion?.id]);

  const activeEliminatedOption = mainQuestion ? eliminatedOptions[mainQuestion.id] : null;

  return (
    <div className="question-console-grid">
      {/* 1. PRE-ROUND RITUAL CONSOLE */}
      {preRoundQuestion && (
        <section className="surface-panel console-card question-marker cinematic-panel pre-round-panel">
          <div className="console-header-badge">
            <span className="eyebrow" style={{ color: '#c6a56a' }}>Island Pre-Round Ritual</span>
            <span className="reward-tag">Potential Reward: {preRoundQuestion.reward_name}</span>
          </div>

          <h3 className="console-title">{preRoundQuestion.label || `${island.name} Pre-Round Trial`}</h3>
          
          <div className="lore-box">
            <p className="lore-text">{preRoundQuestion.question_text}</p>
            {island.id === 3 && (
              <p className="siren-warning-note">
                ⚠️ <em>Warning: Deceptive siren songs fill the air. One incorrect option carries a Hidden Trap (+2.0 Years penalty)!</em>
              </p>
            )}
          </div>

          <form
            className="form-grid cinematic-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!preRoundAnswer) return;
              onSubmitPreRound({ question_id: preRoundQuestion.id, selected_option: preRoundAnswer });
            }}
          >
            {preRoundQuestion.options ? (
              <div className="mcq-options-grid">
                {preRoundQuestion.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`mcq-option-card ${preRoundAnswer === opt ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="pre_round_option"
                      value={opt}
                      checked={preRoundAnswer === opt}
                      onChange={() => setPreRoundAnswer(opt)}
                    />
                    <span className="option-text">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="field">
                <label>Your Spoken Answer</label>
                <input
                  className="cinematic-input"
                  value={preRoundAnswer}
                  onChange={(e) => setPreRoundAnswer(e.target.value)}
                  placeholder="Type your response..."
                  required
                />
              </div>
            )}

            <button
              className="action-button cinematic-button submit-btn"
              type="submit"
              disabled={loading || !preRoundAnswer}
            >
              {loading ? 'Communing with the Oracle...' : '✦ Seal Ritual Choice ✦'}
            </button>
          </form>
        </section>
      )}

      {/* 2. MAIN TRIAL OR ISLAND COMPLETED CONSOLE */}
      {(mainQuestion || isCompleted) && (
        <section className="surface-panel console-card question-marker cinematic-panel">
          <div className="console-header-badge">
            <span className="eyebrow" style={{ color: '#c6a56a' }}>
              {isCompleted ? 'Trial Verdict' : island.pathLabel}
            </span>
            {mainQuestion?.difficulty && (
              <span className={`difficulty-badge ${mainQuestion.difficulty.toLowerCase()}`}>
                {mainQuestion.difficulty}
              </span>
            )}
          </div>

          {isCompleted ? (
            <div className="island-completed-banner">
              <div className="triumph-icon">🏆</div>
              <h3 className="triumph-title">The Guardians Are Appeased</h3>
              <p className="triumph-desc">
                Your crew has conquered all trials of <strong>{island.name}</strong>. The sea winds open a passage forward.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button
                  className="action-button cinematic-button victory-next-btn"
                  onClick={onNextIsland}
                  disabled={loading}
                >
                  {loading
                    ? 'Setting Sail...'
                    : island.id === 1
                    ? "⛵ Sail to Island 2: Cyclop's Island ⛵"
                    : island.id === 2
                    ? '⛵ Sail to Island 3: Sirens Island ⛵'
                    : island.id === 3
                    ? "⛵ Sail to Island 4: Witch's Island ⛵"
                    : '⚓ Sail into Ithaca Harbor ⚓'}
                </button>
                <Link to="/journey" className="ghost-button cinematic-button">
                  🗺️ Return to Ocean Map
                </Link>
              </div>
            </div>
          ) : (
            <>
              {mainQuestion.sequence_number >= 10 && (
                <div className="penalty-alert-box">
                  <span>⚠️</span>
                  <div>
                    <strong>PENALTY TRIAL ACTIVE</strong>
                    <p>Triggered by an earlier mistake on Lotus Island. Solve this to restore your voyage path!</p>
                  </div>
                </div>
              )}

              <h3 className="console-title">{mainQuestion.label || `Trial ${mainQuestion.sequence_number}`}</h3>

              <div className="question-content-box">
                <p className="question-text-rendered">{mainQuestion.question_text}</p>
              </div>

              {/* Cyclops Eye Action if applicable */}
              {island.id === 2 && mainQuestion.format === 'MCQ' && hasCyclopsEye && !activeEliminatedOption && (
                <div className="cyclops-eye-inline-prompt">
                  <span>👁️ Cyclops Eye is ready in your inventory!</span>
                  <button
                    type="button"
                    className="secondary-button cinematic-button small-btn"
                    onClick={() => onUseCyclopsEye && onUseCyclopsEye(mainQuestion.id)}
                    disabled={loading}
                  >
                    Eliminate 1 Wrong Option
                  </button>
                </div>
              )}

              <form
                className="form-grid cinematic-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!mainAnswer) return;
                  onSubmitAnswer({ question_id: mainQuestion.id, answer_string: mainAnswer });
                }}
              >
                {mainQuestion.format === 'MCQ' && mainQuestion.options ? (
                  <div className="mcq-options-grid">
                    {mainQuestion.options.map((opt, i) => {
                      const isEliminated = opt === activeEliminatedOption;
                      return (
                        <label
                          key={i}
                          className={`mcq-option-card ${mainAnswer === opt ? 'selected' : ''} ${
                            isEliminated ? 'eliminated' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="main_option"
                            value={opt}
                            disabled={isEliminated}
                            checked={mainAnswer === opt}
                            onChange={() => !isEliminated && setMainAnswer(opt)}
                          />
                          <span className="option-text">
                            {opt} {isEliminated && <em className="eliminated-tag">(Eliminated by Cyclops Eye)</em>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="field">
                    <label>Enter Final Answer:</label>
                    <input
                      className="cinematic-input"
                      value={mainAnswer}
                      onChange={(e) => setMainAnswer(e.target.value)}
                      placeholder="Type your exact solution..."
                      required
                    />
                    <small className="input-hint">Answers are case-insensitive. Double check spelling before submitting.</small>
                  </div>
                )}

                <button
                  className="action-button cinematic-button submit-btn"
                  type="submit"
                  disabled={loading || !mainAnswer}
                >
                  {loading ? 'Submitting Solution...' : '✦ Offer Answer to the Gods ✦'}
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default QuestionConsole;
