import { useState, useEffect, useMemo } from 'react';

function QuestionTextRenderer({ text }) {
  if (!text) return null;

  // Split text to detect code snippets or pre-formatted sections
  const lines = text.split('\n');
  const renderedElements = [];
  let codeBuffer = [];
  let inCodeBlock = false;

  const flushCodeBuffer = (keyPrefix) => {
    if (codeBuffer.length > 0) {
      renderedElements.push(
        <div key={`${keyPrefix}-code`} className="code-snippet-box">
          <pre style={{ margin: 0, fontFamily: 'inherit', color: 'inherit' }}>
            {codeBuffer.join('\n')}
          </pre>
        </div>
      );
      codeBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for C/code syntax patterns
    const isCodeLine = (
      trimmed.startsWith('int ') ||
      trimmed.startsWith('char ') ||
      trimmed.startsWith('printf(') ||
      trimmed.startsWith('if (') ||
      trimmed.startsWith('while(') ||
      trimmed.startsWith('while (') ||
      trimmed.startsWith('else') ||
      trimmed === '{' ||
      trimmed === '}' ||
      trimmed.startsWith('01000001') ||
      trimmed.startsWith('P1 ->')
    );

    if (isCodeLine) {
      inCodeBlock = true;
      codeBuffer.push(line);
    } else {
      if (inCodeBlock && codeBuffer.length > 0) {
        flushCodeBuffer(index);
        inCodeBlock = false;
      }
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        renderedElements.push(
          <div key={index} style={{ paddingLeft: '12px', margin: '4px 0', color: 'rgba(245, 242, 232, 0.95)' }}>
            {line}
          </div>
        );
      } else if (trimmed === '') {
        renderedElements.push(<div key={index} style={{ height: '8px' }} />);
      } else {
        renderedElements.push(
          <div key={index} style={{ margin: '2px 0' }}>
            {line}
          </div>
        );
      }
    }
  });

  if (codeBuffer.length > 0) {
    flushCodeBuffer('end');
  }

  return <div className="question-text-box">{renderedElements}</div>;
}

function QuestionConsole({ 
  island, 
  onSubmitPreRound, 
  onSubmitAnswer, 
  loading, 
  isCompleted, 
  onNextIsland, 
  preRoundQuestion, 
  mainQuestion, 
  eliminatedOption, 
  sitOutRequired, 
  onSitOutAcknowledge 
}) {
  const [preRoundAnswer, setPreRoundAnswer] = useState('');
  const [mainAnswer, setMainAnswer] = useState('');

  // Clear answers when switching questions
  useEffect(() => {
    setMainAnswer('');
  }, [mainQuestion?.id]);

  useEffect(() => {
    setPreRoundAnswer('');
  }, [preRoundQuestion?.id]);

  const isMainAnswered = mainQuestion?.progress_status !== null && mainQuestion?.progress_status !== undefined;
  const isMainCorrect = mainQuestion?.progress_status === 'CORRECT';
  const isMainIncorrect = mainQuestion?.progress_status === 'INCORRECT';

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="question-console-area">
      {/* 1. PRE-ROUND RITUAL CONSOLE */}
      {preRoundQuestion && (
        <section className="console-card-cinematic">
          <div className="console-header-badge">
            <span className="console-kind-pill">Oracle's Pre-Round Ritual</span>
            <div className="console-rewards-pills">
              <span className="console-reward-val deduct">Divine Artifact Reward</span>
            </div>
          </div>

          <h3 className="console-title-text">
            {island?.title || island?.name} Gateway Challenge
          </h3>

          <QuestionTextRenderer text={preRoundQuestion.question_text} />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (preRoundAnswer) {
                onSubmitPreRound({ question_id: preRoundQuestion.id, selected_option: preRoundAnswer });
              }
            }}
          >
            {preRoundQuestion.options && Array.isArray(preRoundQuestion.options) ? (
              <div className="mcq-options-grid">
                {preRoundQuestion.options.map((opt, i) => {
                  const letter = OPTION_LETTERS[i] || `${i + 1}`;
                  const isSelected = preRoundAnswer === opt;

                  return (
                    <div
                      key={i}
                      className={`mcq-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setPreRoundAnswer(opt)}
                    >
                      <div className="mcq-option-letter">{letter}</div>
                      <div className="mcq-option-text">{opt}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="spoken-input-wrapper">
                <label>Offer Your Response</label>
                <textarea
                  className="spoken-textarea-cinematic"
                  value={preRoundAnswer}
                  onChange={(e) => setPreRoundAnswer(e.target.value)}
                  placeholder="Enter the Oracle's answer..."
                  required
                />
              </div>
            )}

            <button 
              className="spoken-submit-btn" 
              type="submit" 
              disabled={loading || !preRoundAnswer}
            >
              {loading ? 'Consulting the Gods...' : '⚡ Seal Choice & Open Gateway'}
            </button>
          </form>
        </section>
      )}

      {/* 2. AWAITING SELECTION STATE */}
      {!preRoundQuestion && !mainQuestion && !isCompleted && (
        <section className="console-card-cinematic" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <span className="console-kind-pill" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Awaiting Navigator Selection
          </span>
          <h3 className="console-title-text" style={{ fontSize: '1.4rem' }}>
            Select a trial marker above to begin this challenge.
          </h3>
          <p style={{ color: 'rgba(231, 229, 221, 0.65)', maxWidth: '480px', margin: '0 auto' }}>
            Each trial holds the power to reduce your remaining voyage years or test your navigation prowess.
          </p>
        </section>
      )}

      {/* 3. MAIN TRIAL CONSOLE */}
      {!preRoundQuestion && (mainQuestion || isCompleted) && (
        <section className="console-card-cinematic">
          <div className="console-header-badge">
            <span className="console-kind-pill">
              {mainQuestion?.sequence_number >= 10 ? '⚠️ Penalty Trial' : `Main Trial ${mainQuestion?.sequence_number ? `· Stage ${mainQuestion.sequence_number}` : ''}`}
            </span>
            {mainQuestion && (
              <div className="console-rewards-pills">
                <span className="console-reward-val deduct">-{mainQuestion.reward_years || 0.5} Yrs Reward</span>
                <span className="console-reward-val penalty">+{mainQuestion.penalty_years || 2.0} Yrs Penalty</span>
              </div>
            )}
          </div>

          <h3 className="console-title-text">
            {isCompleted 
              ? 'All Island Trials Fulfilled' 
              : (mainQuestion?.sequence_number >= 10 
                  ? 'Redemption Inscription' 
                  : `Trial ${mainQuestion?.sequence_number || 1}: ${island?.title || 'Island Stage'}`)}
          </h3>

          {isCompleted ? (
            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              padding: '2.5rem 2rem',
              background: 'radial-gradient(circle, rgba(137, 171, 118, 0.15) 0%, rgba(5, 15, 25, 0.95) 100%)',
              borderRadius: '16px',
              border: '1.5px solid rgba(137, 171, 118, 0.6)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ color: 'var(--success)', fontSize: '2.5rem', marginBottom: '0.8rem' }}>✓</div>
              <h4 style={{ fontFamily: 'var(--display)', color: 'var(--success)', fontSize: '1.6rem', margin: '0 0 0.6rem 0' }}>
                All Island Trials Completed
              </h4>
              <p style={{ color: 'rgba(231, 229, 221, 0.9)', marginBottom: '1.8rem', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 1.8rem auto' }}>
                The trials of this realm are fulfilled. Set sail to advance across the wine-dark sea toward Ithaca!
              </p>
              <button
                className="spoken-submit-btn"
                onClick={onNextIsland}
                disabled={loading}
                style={{
                  maxWidth: '380px',
                  margin: '0 auto',
                  background: 'linear-gradient(180deg, rgba(137, 171, 118, 0.3) 0%, rgba(137, 171, 118, 0.1) 100%)',
                  borderColor: 'var(--success)',
                  color: 'var(--success)',
                  boxShadow: '0 0 20px rgba(137, 171, 118, 0.3)'
                }}
              >
                {loading ? 'Setting Sail...' : '⛵ Sail to Next Island'}
              </button>
            </div>
          ) : (
            <>
              {sitOutRequired && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1.2rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1.5px solid #ef4444',
                  borderRadius: '12px',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
                }}>
                  <p style={{ color: '#f87171', fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>
                    ⚠️ CIRCE'S CURSE TRIGGERED ⚠️
                  </p>
                  <p style={{ color: 'var(--cloud-white)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    An incorrect answer has provoked Circe! One of your crew members has been transformed into a beast and must sit out this challenge.
                  </p>
                  <button 
                    onClick={onSitOutAcknowledge} 
                    className="hero-action-btn"
                    style={{ width: '100%', borderColor: '#ef4444', color: '#f87171', justifyContent: 'center' }}
                  >
                    Acknowledge Sit-Out
                  </button>
                </div>
              )}

              <QuestionTextRenderer text={mainQuestion?.question_text} />

              {isMainCorrect ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(137, 171, 118, 0.12)',
                  borderRadius: '12px',
                  border: '1.5px solid var(--success)',
                  textAlign: 'center',
                  boxShadow: '0 0 20px rgba(137, 171, 118, 0.2)'
                }}>
                  <span style={{ color: 'var(--success)', fontSize: '2rem', display: 'block', marginBottom: '6px' }}>✓</span>
                  <p style={{ color: 'var(--success)', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                    This trial has been conquered and recorded.
                  </p>
                </div>
              ) : isMainIncorrect ? (
                <div style={{
                  textAlign: 'center',
                  padding: '24px',
                  border: '1.5px solid rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '12px'
                }}>
                  <span style={{ color: '#f87171', fontSize: '2rem', display: 'block', marginBottom: '6px' }}>✕</span>
                  <p style={{ color: '#f87171', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '1.15rem' }}>
                    Attempt Sealed (Incorrect)
                  </p>
                  <p style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.92rem', margin: 0 }}>
                    This trial has been finalized. Proceed to solve the remaining trials or penalty inscriptions.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!sitOutRequired && mainAnswer) {
                      onSubmitAnswer({ question_id: mainQuestion.id, answer_string: mainAnswer });
                    }
                  }}
                >
                  {mainQuestion?.options && Array.isArray(mainQuestion.options) ? (
                    <div className="mcq-options-grid">
                      {mainQuestion.options.map((opt, i) => {
                        const letter = OPTION_LETTERS[i] || `${i + 1}`;
                        const isEliminated = opt === eliminatedOption;
                        const isSelected = mainAnswer === opt;

                        return (
                          <div
                            key={i}
                            className={`mcq-option-card ${isSelected ? 'selected' : ''} ${isEliminated ? 'eliminated' : ''}`}
                            onClick={() => {
                              if (!isEliminated && !sitOutRequired && !loading) {
                                setMainAnswer(opt);
                              }
                            }}
                          >
                            <div className="mcq-option-letter">{letter}</div>
                            <div className="mcq-option-text">
                              {opt} {isEliminated && <span style={{ color: '#f87171', fontSize: '0.8rem', marginLeft: '6px' }}>(Eliminated by Cyclops' Eye)</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="spoken-input-wrapper">
                      <label>Team's Response (Spoken Answer / Value)</label>
                      <textarea
                        className="spoken-textarea-cinematic"
                        value={mainAnswer}
                        onChange={(e) => setMainAnswer(e.target.value)}
                        placeholder="Enter the exact answer or code required..."
                        required
                        disabled={sitOutRequired || loading}
                      />
                    </div>
                  )}

                  <button 
                    className="spoken-submit-btn" 
                    type="submit" 
                    disabled={loading || sitOutRequired || !mainAnswer}
                  >
                    {loading ? 'Submitting Trial...' : '⚡ Offer Answer to the Fates'}
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default QuestionConsole;
