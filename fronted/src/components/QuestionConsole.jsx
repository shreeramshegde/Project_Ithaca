import { useState } from 'react';

const INITIAL_PRE_ROUND = {
  question_id: '',
  selected_option: '',
};

const INITIAL_MAIN = {
  question_id: '',
  answer_string: '',
};

function QuestionConsole({ island, onSubmitPreRound, onSubmitAnswer, loading }) {
  const [preRound, setPreRound] = useState(INITIAL_PRE_ROUND);
  const [mainAnswer, setMainAnswer] = useState(INITIAL_MAIN);

  return (
    <div className="question-console-grid">
      <section className="surface-panel console-card question-marker cinematic-panel">
        <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Pre-round Ritual</p>
        <h3 style={{ fontFamily: 'var(--display)' }}>{island.name} Trial</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Align the artifact frequency (UUID) to open the trial.
        </p>
        <form
          className="form-grid cinematic-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitPreRound(preRound);
          }}
        >
          <div className="field">
            <label htmlFor="pre-question-id">Trial Resonance (UUID)</label>
            <input
              id="pre-question-id"
              className="cinematic-input"
              value={preRound.question_id}
              onChange={(event) => setPreRound((current) => ({ ...current, question_id: event.target.value }))}
              placeholder="Paste resonance frequency"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pre-option">Chosen Path</label>
            <input
              id="pre-option"
              className="cinematic-input"
              value={preRound.selected_option}
              onChange={(event) => setPreRound((current) => ({ ...current, selected_option: event.target.value }))}
              placeholder="A / B / C / D"
              required
            />
          </div>
          <button className="action-button cinematic-button" type="submit" disabled={loading}>
            {loading ? 'Communing...' : 'Seal Choice'}
          </button>
        </form>
      </section>

      <section className="surface-panel console-card question-marker cinematic-panel">
        <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Main Trial Console</p>
        <h3 style={{ fontFamily: 'var(--display)' }}>{island.pathLabel}</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Submit your final answer to appease the guardians of the island.
        </p>
        <form
          className="form-grid cinematic-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitAnswer(mainAnswer);
          }}
        >
          <div className="field">
            <label htmlFor="main-question-id">Trial Resonance (UUID)</label>
            <input
              id="main-question-id"
              className="cinematic-input"
              value={mainAnswer.question_id}
              onChange={(event) => setMainAnswer((current) => ({ ...current, question_id: event.target.value }))}
              placeholder="Paste resonance frequency"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="answer-string">Spoken Answer</label>
            <textarea
              id="answer-string"
              className="cinematic-textarea"
              value={mainAnswer.answer_string}
              onChange={(event) => setMainAnswer((current) => ({ ...current, answer_string: event.target.value }))}
              placeholder="Enter the team's response"
              required
            />
          </div>
          <button className="action-button cinematic-button" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Offer Answer'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default QuestionConsole;
