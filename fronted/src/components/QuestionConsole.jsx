import { useState } from 'react';

const INITIAL_PRE_ROUND = {
  question_id: '',
  selected_option: '',
};

const INITIAL_MAIN = {
  question_id: '',
  answer_string: '',
};

function QuestionConsole({ island, onSubmitPreRound, onSubmitAnswer, loading, isCompleted, onNextIsland, preRoundQuestion, mainQuestion }) {
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
              <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--cloud-white)' }}>
                {mainQuestion.question_text}
              </p>
              <form
                className="form-grid cinematic-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSubmitAnswer({ question_id: mainQuestion.id, answer_string: mainAnswer });
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
                    >
                      <option value="" disabled>Choose wisely...</option>
                      {mainQuestion.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
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
                    />
                  </div>
                )}
                <button className="action-button cinematic-button" type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Offer Answer'}
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
