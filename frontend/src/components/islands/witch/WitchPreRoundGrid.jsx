import React, { useState } from 'react';

/**
 * WitchPreRoundGrid
 *
 * Interactive 10x10 Grid Pathfinding challenge:
 * - Displays 10x10 Cyclops grid image with lightbox zoom
 * - Directional route builder D-Pad buttons (U, D, L, R) with tactile feedback
 * - Minimum cost input field
 * - Submits solution to the PRE_ROUND endpoint
 */
function WitchPreRoundGrid({ question, onSubmit, loading }) {
  const [cost, setCost] = useState('');
  const [route, setRoute] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  const handleAddDirection = (dir) => {
    setRoute((prev) => prev + dir);
  };

  const handleBackspace = () => {
    setRoute((prev) => prev.slice(0, -1));
  };

  const handleClearRoute = () => {
    setRoute('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cost.trim()) return;
    onSubmit({
      question_id: question.id,
      selected_option: cost.trim(),
    });
  };

  return (
    <div className="witch-preround-container">
      {/* Lightbox for 10x10 Grid */}
      {showLightbox && (
        <div className="witch-lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="witch-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="witch-lightbox-close"
              onClick={() => setShowLightbox(false)}
            >
              ✕
            </button>
            <img
              src="/assets/witch/witch_preround_grid.jpeg"
              alt="10x10 Cyclops Island Grid Full View"
              className="witch-lightbox-img"
            />
            <p className="witch-lightbox-caption">10×10 Grid — S (Start) at (0,0), T (Temple) at (9,9)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="witch-challenge-header">
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>SCYLLA PRE-ROUND RITUAL</p>
        <h3 className="witch-challenge-title">The Serpent Walls of the 10×10 Labyrinth</h3>
        <p className="witch-challenge-subtitle">
          Odysseus must calculate the minimum-cost route from Start (S) to the Temple (T) across the serpentine hazards.
        </p>
      </div>

      <div className="witch-grid-layout">
        {/* Left: Grid Image & Rules */}
        <div className="witch-grid-media">
          <div
            className="witch-image-card"
            onClick={() => setShowLightbox(true)}
            title="Click to Zoom 10x10 Grid"
          >
            <img
              src="/assets/witch/witch_preround_grid.jpeg"
              alt="10x10 Cyclops Island Grid"
              className="witch-grid-thumbnail"
            />
            <div className="witch-image-zoom-badge">
              <span>🔍 Click to Enlarge 10×10 Grid</span>
            </div>
          </div>

          <div className="witch-rules-box">
            <h4>Movement Laws:</h4>
            <ul>
              <li><strong>S → T</strong>: Start at (0,0) top-left, reach Temple (9,9) bottom-right.</li>
              <li><strong>Movements</strong>: Up, Down, Left, Right (no diagonals allowed).</li>
              <li><strong className="rule-badge rule-blocked">SN (Snake)</strong>: BLOCKED wall. Cannot enter.</li>
              <li><strong className="rule-badge rule-sea">SEA</strong>: Heavy terrain — costs <strong>2 moves</strong>.</li>
              <li><strong className="rule-badge rule-cyclops">CY (Cyclops)</strong>: Forces 1 additional step in same direction.</li>
              <li><strong className="rule-badge rule-normal">Blank</strong>: Normal terrain — costs <strong>1 move</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Right: Minimum Cost Form */}
        <div className="witch-grid-inputs">
          <form className="witch-answer-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="witch-cost-input">
                Calculated Minimum Total Cost <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <div className="witch-cost-wrapper">
                <input
                  id="witch-cost-input"
                  type="number"
                  min="1"
                  max="100"
                  className="cinematic-input witch-cost-field"
                  placeholder="Enter calculated cost (e.g. 24)..."
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <span className="field-hint">Enter the lowest total movement cost to traverse from S to T</span>
            </div>

            <button
              type="submit"
              className="action-button cinematic-button witch-submit-btn"
              disabled={loading || !cost.trim()}
            >
              {loading ? 'CALCULATING LABYRINTH...' : '⚡ Seal Pre-Round Solution & Dispel Mist'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WitchPreRoundGrid;

