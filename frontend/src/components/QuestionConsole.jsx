import { useState, useEffect } from 'react';
import WitchPreRoundGrid from './islands/witch/WitchPreRoundGrid.jsx';
import WitchDecisionTree from './islands/witch/WitchDecisionTree.jsx';
import CirceTerminal from './islands/witch/CirceTerminal.jsx';
import RunicSudoku from './games/RunicSudoku.jsx';

function CodeBlockWithCopy({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-snippet-box" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: copied ? 'rgba(137, 171, 118, 0.25)' : 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${copied ? 'var(--success)' : 'rgba(198, 165, 106, 0.3)'}`,
          color: copied ? 'var(--success)' : 'var(--cloud-white)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '0.72rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="Copy code snippet"
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </>
        )}
      </button>
      <pre style={{ margin: 0, fontFamily: 'inherit', color: 'inherit', paddingRight: '60px' }}>
        {code}
      </pre>
    </div>
  );
}

function QuestionTextRenderer({ text }) {
  if (!text) return null;

  // Split text to detect code snippets or pre-formatted sections
  const lines = text.split('\n');
  const renderedElements = [];
  let codeBuffer = [];
  let inFencedBlock = false;
  let inAutoCodeBlock = false;

  const flushCodeBuffer = (keyPrefix) => {
    if (codeBuffer.length > 0) {
      const codeText = codeBuffer.join('\n');
      renderedElements.push(
        <CodeBlockWithCopy key={`${keyPrefix}-code`} code={codeText} />
      );
      codeBuffer = [];
    }
  };

  const isCodeStart = (trimmed) => {
    return (
      trimmed.startsWith('int ') ||
      trimmed.startsWith('char ') ||
      trimmed.startsWith('total =') ||
      trimmed.startsWith('total=') ||
      trimmed.startsWith('for i in range') ||
      trimmed.startsWith('while(') ||
      trimmed.startsWith('while (') ||
      trimmed.startsWith('if (') ||
      trimmed.startsWith('01000001') ||
      trimmed.startsWith('P1 ->')
    );
  };

  const isCodeContinuation = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return true; // keep blank lines inside code blocks
    return (
      line.startsWith('    ') ||
      line.startsWith('\t') ||
      trimmed.startsWith('if ') ||
      trimmed.startsWith('else:') ||
      trimmed.startsWith('else') ||
      trimmed.startsWith('total +=') ||
      trimmed.startsWith('total -=') ||
      trimmed.startsWith('print(') ||
      trimmed.startsWith('printf(') ||
      trimmed.startsWith('return ') ||
      trimmed === '{' ||
      trimmed === '}' ||
      trimmed.endsWith(';') ||
      trimmed.endsWith(':')
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for markdown code fences ```
    if (trimmed.startsWith('```')) {
      if (inFencedBlock) {
        flushCodeBuffer(`fence-${index}`);
        inFencedBlock = false;
      } else {
        if (inAutoCodeBlock) {
          flushCodeBuffer(`auto-${index}`);
          inAutoCodeBlock = false;
        }
        inFencedBlock = true;
      }
      return;
    }

    if (inFencedBlock) {
      codeBuffer.push(line);
      return;
    }

    if (!inAutoCodeBlock && isCodeStart(trimmed)) {
      inAutoCodeBlock = true;
      codeBuffer.push(line);
    } else if (inAutoCodeBlock) {
      if (isCodeContinuation(line)) {
        codeBuffer.push(line);
      } else {
        flushCodeBuffer(`auto-${index}`);
        inAutoCodeBlock = false;
        
        // Render current non-code line
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
    } else {
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

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function QuestionConsole({ 
  island, 
  onSubmitPreRound, 
  onSubmitAnswer, 
  loading, 
  isCompleted, 
  onNextIsland, 
  preRoundQuestion, 
  mainQuestion, 
  revealedHint, 
  eliminatedOption, 
  sitOutRequired, 
  onSitOutAcknowledge,
  autoFillAnswer,
  isPuzzleSolved,
  onSolvePuzzle
}) {
  const [preRoundAnswer, setPreRoundAnswer] = useState('');
  const [mainAnswer, setMainAnswer] = useState('');

  // Clear answers when switching questions
  useEffect(() => {
    setMainAnswer(autoFillAnswer || '');
  }, [mainQuestion?.id, autoFillAnswer]);

  useEffect(() => {
    setPreRoundAnswer('');
  }, [preRoundQuestion?.id]);

  const isMainCorrect = mainQuestion?.progress_status === 'CORRECT';
  const isMainIncorrect = mainQuestion?.progress_status === 'INCORRECT';

  // Keyboard shortcut listener for MCQ options (A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid overriding inside form inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      const letterIndex = OPTION_LETTERS.indexOf(key);

      if (preRoundQuestion?.options && letterIndex !== -1 && letterIndex < preRoundQuestion.options.length) {
        const option = preRoundQuestion.options[letterIndex];
        setPreRoundAnswer(option);
      } else if (mainQuestion?.options && letterIndex !== -1 && letterIndex < mainQuestion.options.length) {
        const option = mainQuestion.options[letterIndex];
        if (option !== eliminatedOption && !sitOutRequired && !loading && !isMainCorrect && !isMainIncorrect) {
          setMainAnswer(option);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preRoundQuestion, mainQuestion, eliminatedOption, sitOutRequired, loading, isMainCorrect, isMainIncorrect]);

  return (
    <div className="question-console-area">
      {/* 1. PRE-ROUND RITUAL CONSOLE */}
      {preRoundQuestion && (
        <section className="console-card-cinematic">
          {island?.slug === 'witch' || island?.id === 4 ? (
            <WitchPreRoundGrid
              question={preRoundQuestion}
              onSubmit={onSubmitPreRound}
              loading={loading}
            />
          ) : (
            <>
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
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPreRoundAnswer(opt); }}
                        >
                          <div className="mcq-option-letter">{letter}</div>
                          <div className="mcq-option-text">{opt}</div>
                          <div className="mcq-option-indicator">
                            <span className="mcq-kbd-hint">[{letter}]</span>
                            <span className={`mcq-check-circle ${isSelected ? 'active' : ''}`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
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

                <div className="console-submit-row">
                  <button 
                    className="spoken-submit-btn" 
                    type="submit" 
                    disabled={loading || !preRoundAnswer}
                  >
                    {loading ? 'Consulting the Gods...' : '⚡ Seal Choice & Open Gateway'}
                  </button>
                </div>
              </form>
            </>
          )}
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
              {mainQuestion?.sequence_number > 4 ? `⚠️ Penalty Inscription ${mainQuestion.sequence_number - 4}` : `Main Trial ${mainQuestion?.sequence_number ? `· Stage ${mainQuestion.sequence_number}` : ''}`}
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
              : (mainQuestion?.sequence_number > 4 
                  ? `Penalty Inscription ${mainQuestion.sequence_number - 4}` 
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

              {island?.slug === 'witch' && mainQuestion?.sequence_number === 1 && !isMainCorrect && !isMainIncorrect ? (
                <WitchDecisionTree
                  question={mainQuestion}
                  onSubmit={onSubmitAnswer}
                  loading={loading}
                />
              ) : island?.slug === 'witch' && !isPuzzleSolved ? (
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
              ) : island?.slug === 'witch' && mainQuestion?.sequence_number === 2 && !isMainCorrect && !isMainIncorrect ? (
                <CirceTerminal
                  question={mainQuestion}
                  onSubmit={onSubmitAnswer}
                  loading={loading}
                />
              ) : (
                <>
                  <QuestionTextRenderer text={mainQuestion?.question_text} />

              {revealedHint && (
                <div style={{
                  margin: '16px 0',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, rgba(198, 165, 106, 0.18) 0%, rgba(7, 21, 38, 0.95) 100%)',
                  border: '1.5px solid var(--gold)',
                  borderRadius: '12px',
                  boxShadow: '0 0 25px rgba(198, 165, 106, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>🔮</span>
                  <div>
                    <strong style={{ color: 'var(--gold)', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
                      Oracle's Revealed Clue:
                    </strong>
                    <span style={{ color: 'rgba(245, 242, 232, 0.95)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{revealedHint}"
                    </span>
                  </div>
                </div>
              )}

              {isMainCorrect ? (
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(137, 171, 118, 0.2) 0%, rgba(7, 21, 38, 0.95) 100%)',
                  borderRadius: '12px',
                  border: '2px solid #89ab76',
                  textAlign: 'center',
                  boxShadow: '0 0 25px rgba(137, 171, 118, 0.35)',
                  margin: '16px 0'
                }}>
                  <span style={{ color: '#89ab76', fontSize: '2.5rem', display: 'block', marginBottom: '6px' }}>✓</span>
                  <p style={{ color: '#89ab76', margin: 0, fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--display)' }}>
                    Correct Answer Recorded!
                  </p>
                  <span style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.9rem', display: 'block', marginTop: '6px' }}>
                    Years have been deducted from your voyage.
                  </span>
                </div>
              ) : isMainIncorrect ? (
                <div style={{
                  textAlign: 'center',
                  padding: '24px',
                  border: '2px solid #ef4444',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(7, 21, 38, 0.95) 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
                  margin: '16px 0'
                }}>
                  <span style={{ color: '#ef4444', fontSize: '2.5rem', display: 'block', marginBottom: '6px' }}>✕</span>
                  <p style={{ color: '#ef4444', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--display)' }}>
                    Incorrect Answer (Penalty Incurred)
                  </p>
                  <p style={{ color: 'rgba(231, 229, 221, 0.8)', fontSize: '0.9rem', margin: 0 }}>
                    Penalty years added to your voyage. Continue to solve remaining trials.
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
                            role="button"
                            tabIndex={isEliminated ? -1 : 0}
                            onKeyDown={(e) => { 
                              if (!isEliminated && (e.key === 'Enter' || e.key === ' ')) {
                                setMainAnswer(opt);
                              }
                            }}
                          >
                            <div className="mcq-option-letter">{letter}</div>
                            <div className="mcq-option-text">
                              {opt} {isEliminated && <span style={{ color: '#f87171', fontSize: '0.8rem', marginLeft: '6px' }}>(Eliminated by Cyclops' Eye)</span>}
                            </div>
                            <div className="mcq-option-indicator">
                              <span className="mcq-kbd-hint">[{letter}]</span>
                              <span className={`mcq-check-circle ${isSelected ? 'active' : ''}`}>
                                {isSelected ? '✓' : ''}
                              </span>
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

                  <div className="console-submit-row">
                    <button 
                      className="spoken-submit-btn" 
                      type="submit" 
                      disabled={loading || sitOutRequired || !mainAnswer}
                    >
                      {loading ? 'Submitting Trial...' : '⚡ Offer Answer to the Fates'}
                    </button>
                  </div>
                </form>
              )}
                </>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default QuestionConsole;
