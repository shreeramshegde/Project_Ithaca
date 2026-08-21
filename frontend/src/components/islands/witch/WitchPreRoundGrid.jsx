import React, { useState } from 'react';

/**
 * WitchPreRoundGrid
 *
 * Interactive 10x10 Grid Pathfinding challenge:
 * - Displays 10x10 Cyclops grid image with lightbox zoom
 * - Directional route builder buttons (U, D, L, R)
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
    // Submit minimum cost as the primary answer payload
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
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>WITCH PRE-ROUND RITUAL</p>
        <h3 className="witch-challenge-title">The Serpent Walls of the 10×10 Labyrinth</h3>
      </div>

      <div className="witch-grid-layout">
        {/* Left / Top: Grid Image & Rules */}
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
              <span>🔍 Click to Enlarge Grid</span>
            </div>
          </div>

          <div className="witch-rules-box">
            <h4>Movement Rules</h4>
            <ul>
              <li><strong>S → T</strong>: Start at top-left, reach Temple at bottom-right.</li>
              <li><strong>Up, Down, Left, Right</strong>: No diagonal moves.</li>
              <li><strong style={{ color: '#ff6b6b' }}>SN (Snake)</strong>: BLOCKED. Cannot enter.</li>
              <li><strong style={{ color: '#4dabf7' }}>SEA</strong>: Costs <strong>2 moves</strong> to enter instead of 1.</li>
              <li><strong style={{ color: '#cc5de8' }}>CY (Cyclops)</strong>: Forces 1 more step in same direction.</li>
              <li><strong>Normal blank cells</strong>: Cost <strong>1 move</strong> to enter.</li>
            </ul>
          </div>
        </div>

        {/* Right / Bottom: Interactive Route Scratchpad & Cost Form */}
        <div className="witch-grid-inputs">
          <form className="witch-answer-form" onSubmit={handleSubmit}>
            {/* Minimum Cost (Primary Answer) */}
            <div className="field">
              <label htmlFor="witch-cost-input">
                1. Calculated Minimum Total Cost <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                id="witch-cost-input"
                type="number"
                min="1"
                max="100"
                className="cinematic-input witch-cost-field"
                placeholder="e.g. 31"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                disabled={loading}
              />
              <span className="field-hint">Calculate the lowest total move cost from S to T</span>
            </div>

            {/* Directional Route Scratchpad */}
            <div className="field">
              <label htmlFor="witch-route-input">
                2. Directional Route Scratchpad (Optional Working Notes)
              </label>
              <div className="witch-route-display">
                <code>{route || 'Click buttons below or type route (U / D / L / R)...'}</code>
              </div>
              <input
                id="witch-route-input"
                type="text"
                className="cinematic-input"
                placeholder="e.g. DDDDDDDRRRR..."
                value={route}
                onChange={(e) => setRoute(e.target.value.toUpperCase().replace(/[^UDLR]/g, ''))}
                disabled={loading}
              />

              {/* D-Pad Buttons */}
              <div className="witch-dpad">
                <button type="button" className="dpad-btn" onClick={() => handleAddDirection('U')}>⬆ U</button>
                <div className="dpad-middle-row">
                  <button type="button" className="dpad-btn" onClick={() => handleAddDirection('L')}>⬅ L</button>
                  <button type="button" className="dpad-btn" onClick={() => handleAddDirection('D')}>⬇ D</button>
                  <button type="button" className="dpad-btn" onClick={() => handleAddDirection('R')}>➡ R</button>
                </div>
                <div className="dpad-actions">
                  <button type="button" className="dpad-action-btn" onClick={handleBackspace}>⌫ Back</button>
                  <button type="button" className="dpad-action-btn" onClick={handleClearRoute}>⟲ Clear</button>
                </div>
              </div>
              <span className="field-hint">Step count: {route.length} moves</span>
            </div>

            <button
              type="submit"
              className="action-button cinematic-button witch-submit-btn"
              disabled={loading || !cost.trim()}
            >
              {loading ? 'CALCULATING ROUTE...' : 'Seal Pre-Round Choice'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WitchPreRoundGrid;
