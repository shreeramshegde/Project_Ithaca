import React, { useEffect, useRef } from 'react';
import { STORY_VIDEOS } from '../../data/storyTimeline.js';

/**
 * StoryVideo
 *
 * Seamless multi-track cinematic video player.
 * Preloads and smoothly cross-dissolves between all 5 video chapters with zero black cuts,
 * zero buffering hitch, and continuous motion continuity.
 */
function StoryVideo({
  currentVideoIndex,
  onTimeUpdate,
  onEnded,
  isTransitioning,
}) {
  const videoRefs = useRef([]);

  // Initialize refs array
  videoRefs.current = STORY_VIDEOS.map(
    (_, i) => videoRefs.current[i] || React.createRef()
  );

  // Manage playback and smooth audio transition when active video changes
  useEffect(() => {
    STORY_VIDEOS.forEach((_, idx) => {
      const el = videoRefs.current[idx]?.current;
      if (!el) return;

      if (idx === currentVideoIndex) {
        // Active video: unmute, reset if starting, and play
        el.muted = false;
        el.currentTime = 0;
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn(`Autoplay with sound prevented for video ${idx}:`, err);
            // Fallback to muted if user hasn't interacted yet
            el.muted = true;
            el.play().catch(() => {});
          });
        }
      } else {
        // Inactive videos: mute immediately so no audio conflicts
        el.muted = true;
        // Pause after brief crossfade so outgoing visuals finish cleanly
        setTimeout(() => {
          if (idx !== currentVideoIndex) {
            el.pause();
          }
        }, 650);
      }
    });
  }, [currentVideoIndex]);

  // Preload upcoming video for instant zero-lag transition
  useEffect(() => {
    const nextIdx = currentVideoIndex + 1;
    if (nextIdx < STORY_VIDEOS.length) {
      const nextEl = videoRefs.current[nextIdx]?.current;
      if (nextEl) {
        nextEl.load();
      }
    }
  }, [currentVideoIndex]);

  return (
    <div className="story-video-container">
      {STORY_VIDEOS.map((video, idx) => {
        const isActive = idx === currentVideoIndex;
        return (
          <video
            key={video.src}
            ref={videoRefs.current[idx]}
            className={`story-video-element ${isActive ? 'active-track' : 'inactive-track'}`}
            src={video.src}
            preload="auto"
            playsInline
            onTimeUpdate={(e) => {
              if (idx === currentVideoIndex) {
                onTimeUpdate(e.currentTarget.currentTime);
              }
            }}
            onEnded={() => {
              if (idx === currentVideoIndex) {
                onEnded();
              }
            }}
          />
        );
      })}
      <div className="story-video-vignette" />
    </div>
  );
}

export default StoryVideo;
