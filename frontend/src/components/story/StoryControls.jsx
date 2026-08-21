import React from 'react';

/**
 * StoryControls
 *
 * Renders unobtrusive cinematic HUD controls:
 * - "SKIP STORY →" on top-right to jump straight to the call to adventure
 */
function StoryControls({ onSkip }) {
  return (
    <div className="story-controls-overlay">
      <div />
      {/* Skip Story */}
      <button
        type="button"
        className="story-skip-button cinematic-button"
        onClick={onSkip}
        title="Skip Cinematic Story"
      >
        SKIP STORY →
      </button>
    </div>
  );
}

export default StoryControls;
