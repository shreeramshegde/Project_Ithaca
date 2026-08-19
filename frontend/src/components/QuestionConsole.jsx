import { useState } from 'react';

const INITIAL_PRE_ROUND = {
  question_id: '',
  selected_option: '',
};

const INITIAL_MAIN = {
  question_id: '',
  answer_string: '',
};

function QuestionConsole({ island, onSubmitPreRound, onSubmitAnswer, loading, isCompleted, onNextIsland, preRoundQuestion, mainQuestion, disableRetry, eliminatedOption, sitOutRequired, onSitOutAcknowledge }) {
  const [preRoundAnswer, setPreRoundAnswer] = useState('');
  const [mainAnswer, setMainAnswer] = useState('');

  return (
    <div className="question-console-grid">
      {preRoundQuestion && (
        <section className="surface-panel console-card question-marker cinematic-panel">
          <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Pre-round Ritual</p>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: '1rem' }}>{island.name} Trial</h3>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--cloud-white)' }}>
            {preRoundQuestion.question_text}
          </p>
          <form
            className="form-grid cinematic-form"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitPreRound({ question_id: preRoundQuestion.id, selected_option: preRoundAnswer });
            }}
          >
            {preRoundQuestion.options ? (
              <div className="field">
                <label>Select your answer</label>
                <select
                  className="cinematic-input"
                  value={preRoundAnswer}
                  onChange={(e) => setPreRoundAnswer(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose wisely...</option>
                  {preRoundQuestion.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="field">
                <label>Your Answer</label>
                <input
                  className="cinematic-input"
                  value={preRoundAnswer}
                  onChange={(e) => setPreRoundAnswer(e.target.value)}
                  placeholder="Type your response"
                  required
                />
              </div>
            )}
            <button className="action-button cinematic-button" type="submit" disabled={loading}>
              {loading ? 'Communing...' : 'Seal Choice'}
            </button>
          </form>
        </section>
      )}

      {(!preRoundQuestion && !mainQuestion && !isCompleted) && (
        <section className="surface-panel console-card question-marker cinematic-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)', marginBottom: '1rem' }}>Awaiting Selection</p>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', color: 'var(--cloud-white)' }}>
            Select a trial from the markers above to continue your journey.
          </h3>
        </section>
      )}

      {(mainQuestion || isCompleted) && (
        <section className="surface-panel console-card question-marker cinematic-panel">
          <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Main Trial Console</p>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: '1rem' }}>{island.pathLabel}</h3>

          {isCompleted ? (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--success)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                The guardians are appeased. The path is clear.
              </p>
              <button
                className="action-button cinematic-button"
                onClick={onNextIsland}
                disabled={loading}
                style={{ width: '100%', borderColor: 'var(--success)', color: 'var(--success)' }}
              >
                {loading ? 'Sailing...' : 'Sail to Next Island'}
              </button>
            </div>
          ) : (
            <>
              {mainQuestion.sequence_number >= 10 && (
                <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 'bold' }}>
                  PENALTY TRIAL ACTIVE
                </p>
              )}
              {sitOutRequired && (
                <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255, 60, 60, 0.2)', border: '1px solid var(--danger)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ CIRCE'S CURSE TRIGGERED ⚠️</p>
                  <p style={{ color: 'var(--cloud-white)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    An incorrect answer has provoked Circe! One of your crew members has been transformed into a pig and must sit out this challenge.
                  </p>
                  <button onClick={onSitOutAcknowledge} className="action-button cinematic-button" style={{ width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    Acknowledge Sit-Out
                  </button>
                </div>
              )}
              <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--cloud-white)' }}>
                {mainQuestion.question_text}
              </p>
              {mainQuestion.is_correct ? (
                <div style={{ padding: '20px', background: 'rgba(7, 21, 38, 0.5)', borderRadius: '8px', border: '1px solid var(--success)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--success)', margin: 0 }}>This trial has already been completed successfully.</p>
                </div>
              ) : disableRetry && Number(mainQuestion.incorrect_attempts || 0) > 0 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>Attempt Sealed</p>
                  <p style={{ color: 'var(--cloud)', fontSize: '0.9rem' }}>The fates have recorded your answer for this trial.</p>
                </div>
              ) : (
                <form
                  className="form-grid cinematic-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!sitOutRequired) {
                      onSubmitAnswer({ question_id: mainQuestion.id, answer_string: mainAnswer });
                    }
                  }}
                >
                  {mainQuestion.options ? (
                    <div className="field">
                      <label>Select your answer</label>
                      <select
                        className="cinematic-input"
                        value={mainAnswer}
                        onChange={(e) => setMainAnswer(e.target.value)}
                        required
                        disabled={sitOutRequired}
                      >
                        <option value="" disabled>Choose wisely...</option>
                        {mainQuestion.options.map((opt, i) => (
                          <option
                            key={i}
                            value={opt}
                            disabled={opt === eliminatedOption}
                            style={{ textDecoration: opt === eliminatedOption ? 'line-through' : 'none', color: opt === eliminatedOption ? '#666' : 'inherit' }}
                          >
                            {opt} {opt === eliminatedOption ? '(Eliminated)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="field">
                      <label>Spoken Answer</label>
                      <textarea
                        className="cinematic-textarea"
                        value={mainAnswer}
                        onChange={(e) => setMainAnswer(e.target.value)}
                        placeholder="Enter the team's response"
                        required
                        disabled={sitOutRequired}
                      />
                    </div>
                  )}
                  <button className="action-button cinematic-button" type="submit" disabled={loading || sitOutRequired}>
                    {loading ? 'Submitting...' : 'Offer Answer'}
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
