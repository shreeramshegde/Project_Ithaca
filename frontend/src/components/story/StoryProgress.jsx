import React from 'react';

/**
 * StoryProgress
 *
 * Renders a minimalist, non-intrusive bronze timeline progress hairline
 * indicating playback position across the 50s odyssey.
 */
function StoryProgress({ currentVideoIndex, currentTime, totalVideos = 5, videoDuration = 10 }) {
  const totalSeconds = totalVideos * videoDuration;
  const currentTotalSeconds = currentVideoIndex * videoDuration + Math.min(currentTime, videoDuration);
  const percentage = Math.min(Math.max((currentTotalSeconds / totalSeconds) * 100, 0), 100);

  return (
    <div className="story-progress-wrapper" aria-label="Story Progress">
      <div className="story-progress-bar">
        <div
          className="story-progress-fill"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="story-progress-pip"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="story-progress-chapters">
        {Array.from({ length: totalVideos }).map((_, idx) => (
          <span
            key={idx}
            className={`story-chapter-dot ${idx <= currentVideoIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default StoryProgress;
