import React from 'react';

function StoryControls({ onSkip, isMuted, onToggleMute }) {
  return (
    <div className="story-controls-overlay">
      {/* Sound Toggle */}
      <button
        type="button"
        className="story-mute-button cinematic-button"
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Audio (Sound is Off)' : 'Mute Audio (Sound is On)'}
      >
        <span className="story-ctrl-icon">{isMuted ? '🔇' : '🔊'}</span>
        <span>{isMuted ? 'UNMUTE AUDIO' : 'SOUND ON'}</span>
      </button>

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
