import React, { useState } from 'react';

const SHIPS_DATA = [
  { ship: 'A', speed: 8, distance: 3, waves: 7, hiddenNum: 4 },
  { ship: 'B', speed: 8, distance: 6, waves: 4, hiddenNum: 7 },
  { ship: 'C', speed: 6, distance: 8, waves: 2, hiddenNum: 2 },
  { ship: 'D', speed: 5, distance: 7, waves: 5, hiddenNum: 9 },
  { ship: 'E', speed: 9, distance: 6, waves: 8, hiddenNum: 5 },
  { ship: 'F', speed: 4, distance: 4, waves: 7, hiddenNum: 1 },
  { ship: 'G', speed: 7, distance: 5, waves: 3, hiddenNum: 8 },
  { ship: 'H', speed: 3, distance: 5, waves: 4, hiddenNum: 6 },
];

/**
 * WitchDecisionTree
 *
 * Interactive Decision Tree & Ship Classification challenge:
 * - Dual image reference (Rules Tree + Ships Table) with zoom lightbox
 * - Interactive Ship Classification scratchpad (SAFE / DANGER toggles)
 * - 6-Digit Monospace Final Escape Code Input
 * - Submits final code to the backend
 */
function WitchDecisionTree({ question, onSubmit, loading }) {
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'tree' | 'ships'
  const [lightboxImg, setLightboxImg] = useState(null);
  const [shipStatuses, setShipStatuses] = useState({
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
    G: null,
    H: null,
  });
  const [escapeCode, setEscapeCode] = useState('');

  const toggleShipStatus = (shipKey, status) => {
    setShipStatuses((prev) => ({
      ...prev,
      [shipKey]: prev[shipKey] === status ? null : status,
    }));
  };

  // Compute kept numbers from safe ships in order A -> H
  const keptNumbers = SHIPS_DATA.filter((s) => shipStatuses[s.ship] === 'SAFE')
    .map((s) => s.hiddenNum)
    .join('');

  const handleApplyKeptNumbers = () => {
    if (keptNumbers) {
      setEscapeCode(keptNumbers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!escapeCode.trim()) return;
    onSubmit({
      question_id: question.id,
      answer_string: escapeCode.trim(),
    });
  };

  return (
    <div className="witch-decision-tree-container">
      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="witch-lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="witch-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="witch-lightbox-close"
              onClick={() => setLightboxImg(null)}
            >
              ✕
            </button>
            <img src={lightboxImg.src} alt={lightboxImg.alt} className="witch-lightbox-img" />
            <p className="witch-lightbox-caption">{lightboxImg.title}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="witch-challenge-header">
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>WITCH MAIN TRIAL 1</p>
        <h3 className="witch-challenge-title">The Forbidden Decision Tree & The Eight Ships</h3>
        <p className="witch-challenge-subtitle">
          Classify approaching ships A through H as SAFE or DANGER. Discard numbers from DANGER vessels to synthesize the 6-digit escape code.
        </p>
      </div>

      {/* Image Reference Section */}
      <div className="witch-tree-media-panel">
        <div className="witch-tab-controls">
          <button
            type="button"
            className={`witch-tab-btn ${activeTab === 'both' ? 'active' : ''}`}
            onClick={() => setActiveTab('both')}
          >
            Side-by-Side View
          </button>
          <button
            type="button"
            className={`witch-tab-btn ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tree')}
          >
            Decision Tree Rules
          </button>
          <button
            type="button"
            className={`witch-tab-btn ${activeTab === 'ships' ? 'active' : ''}`}
            onClick={() => setActiveTab('ships')}
          >
            The Eight Ships Table
          </button>
        </div>

        <div className={`witch-images-row ${activeTab}`}>
          {(activeTab === 'both' || activeTab === 'tree') && (
            <div
              className="witch-image-card"
              onClick={() =>
                setLightboxImg({
                  src: '/assets/witch/witch_decision_tree.jpeg',
                  alt: 'Decision Tree Rules',
                  title: 'The Witch’s Decision Tree Rules',
                })
              }
            >
              <img
                src="/assets/witch/witch_decision_tree.jpeg"
                alt="Decision Tree Rules"
                className="witch-doc-image"
              />
              <div className="witch-image-zoom-badge">
                <span>🔍 Enlarge Decision Tree</span>
              </div>
            </div>
          )}

          {(activeTab === 'both' || activeTab === 'ships') && (
            <div
              className="witch-image-card"
              onClick={() =>
                setLightboxImg({
                  src: '/assets/witch/witch_ships_table.jpeg',
                  alt: 'The Eight Ships Data',
                  title: 'The Eight Ships Approaching Aeaea',
                })
              }
            >
              <img
                src="/assets/witch/witch_ships_table.jpeg"
                alt="The Eight Ships Data"
                className="witch-doc-image"
              />
              <div className="witch-image-zoom-badge">
                <span>🔍 Enlarge Ships Table</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Ship Classification Scratchpad */}
      <div className="witch-scratchpad-card">
        <div className="witch-scratchpad-header">
          <h4>Ship Classification Scratchpad</h4>
          <p>Classify each ship using the Decision Tree rules to collect the surviving escape digits:</p>
        </div>

        <div className="witch-table-responsive">
          <table className="witch-ships-table">
            <thead>
              <tr>
                <th>Ship</th>
                <th>Speed</th>
                <th>Distance</th>
                <th>Waves</th>
                <th>Hidden Num</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {SHIPS_DATA.map((row) => {
                const status = shipStatuses[row.ship];
                return (
                  <tr key={row.ship} className={`ship-row ${status ? status.toLowerCase() : ''}`}>
                    <td><strong className="ship-letter">{row.ship}</strong></td>
                    <td>{row.speed}</td>
                    <td>{row.distance}</td>
                    <td>{row.waves}</td>
                    <td><span className="hidden-num-tag">{row.hiddenNum}</span></td>
                    <td>
                      <div className="classification-buttons">
                        <button
                          type="button"
                          className={`class-btn safe ${status === 'SAFE' ? 'selected' : ''}`}
                          onClick={() => toggleShipStatus(row.ship, 'SAFE')}
                        >
                          ✓ SAFE
                        </button>
                        <button
                          type="button"
                          className={`class-btn danger ${status === 'DANGER' ? 'selected' : ''}`}
                          onClick={() => toggleShipStatus(row.ship, 'DANGER')}
                        >
                          ✕ DANGER
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scratchpad Summary */}
        <div className="witch-scratchpad-summary">
          <div className="summary-info">
            <span>Surviving Digits from SAFE Ships (A → H):</span>
            <strong className="kept-digits-preview">
              {keptNumbers ? (
                <>
                  <span className="digits-pill">{keptNumbers}</span>
                  <button
                    type="button"
                    className="apply-kept-btn"
                    onClick={handleApplyKeptNumbers}
                    title="Transfer digits to Escape Code input"
                  >
                    Apply to Escape Code ➔
                  </button>
                </>
              ) : (
                <span style={{ color: 'rgba(231,229,221,0.4)', fontStyle: 'italic' }}>
                  No ships classified as SAFE yet
                </span>
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Final Escape Code Submission Form */}
      <form className="witch-answer-form" onSubmit={handleSubmit}>
        <div className="field" style={{ width: '100%', maxWidth: '580px', margin: '0 auto 16px auto' }}>
          <label htmlFor="witch-escape-code" style={{ display: 'block', textAlign: 'center', marginBottom: '8px' }}>
            Final Escape Code <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <div className="witch-code-input-wrapper" style={{ justifyContent: 'center' }}>
            <input
              id="witch-escape-code"
              type="text"
              maxLength="8"
              className="cinematic-input witch-code-field"
              placeholder="_ _ _ _ _ _"
              value={escapeCode}
              onChange={(e) => setEscapeCode(e.target.value.replace(/[^0-9]/g, ''))}
              required
              disabled={loading}
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontWeight: 'bold' }}
            />
          </div>
          <span className="field-hint" style={{ textAlign: 'center', display: 'block', marginTop: '6px' }}>
            Enter the 6 final escape digits from the surviving safe ships in order A → H.
          </span>
        </div>

        <button
          type="submit"
          className="action-button cinematic-button witch-submit-btn"
          disabled={loading || !escapeCode.trim()}
          style={{ maxWidth: '440px', margin: '0 auto' }}
        >
          {loading ? 'TRANSMITTING ESCAPE CODE...' : '⚡ Transmit Final Escape Code'}
        </button>
      </form>
    </div>
  );
}

export default WitchDecisionTree;

