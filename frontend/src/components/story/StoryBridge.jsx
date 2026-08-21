import React from 'react';

/**
 * StoryBridge
 *
 * Emotional transition bridge and interactive call to adventure:
 * "FOUR TRIALS. ONE JOURNEY HOME."
 * -> "PROJECT ITHACA: THE TECH ODYSSEY"
 * -> "BEGIN JOURNEY" CTA button
 * -> "↺ REWATCH STORY" secondary action
 */
function StoryBridge({ onBeginJourney, onRewatch }) {
  return (
    <div className="story-bridge-container">
      {/* Background Ocean Atmosphere */}
      <div className="story-bridge-ocean" />
      <div className="story-bridge-vignette" />

      <div className="story-bridge-content">
        <p className="story-bridge-eyebrow">THE ODYSSEY AWAITS</p>
        
        <h1 className="story-bridge-title">
          PROJECT ITHACA
        </h1>
        
        <p className="story-bridge-subtitle">
          THE TECH ODYSSEY
        </p>

        <div className="story-bridge-mantra">
          <span>FOUR TRIALS</span>
          <span className="bullet">✦</span>
          <span>ONE JOURNEY HOME</span>
        </div>

        <p className="story-bridge-prompt">
          YOUR ODYSSEY BEGINS
        </p>

        <div className="story-bridge-actions">
          <button
            type="button"
            className="story-begin-button cinematic-button"
            onClick={onBeginJourney}
          >
            BEGIN JOURNEY
          </button>

          <button
            type="button"
            className="story-rewatch-button cinematic-button"
            onClick={onRewatch}
          >
            <span>↺</span> REWATCH STORY
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryBridge;
