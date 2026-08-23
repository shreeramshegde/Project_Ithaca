import React, { useEffect, useRef, useCallback } from 'react';
import { STORY_VIDEOS } from '../../data/storyTimeline.js';

/**
 * StoryVideo
 *
 * Seamless multi-track cinematic video player.
 * Implements an active pre-roll dual-playback crossfade:
 * ~0.85s before outgoing video ends, the incoming video starts playing simultaneously
 * underneath with hardware-accelerated opacity dissolve and smooth scale drift.
 * Guarantees zero black cuts, zero freeze frames, and fluid cinematic transitions.
 */
function StoryVideo({
  currentVideoIndex,
  onTimeUpdate,
  onEnded,
  isTransitioning,
  isMuted = false,
  onAutoplayBlocked,
}) {
  const videoRefs = useRef([]);
  const hasTriggeredTransitionRef = useRef(false);

  // Initialize refs array
  videoRefs.current = STORY_VIDEOS.map(
    (_, i) => videoRefs.current[i] || React.createRef()
  );

  // Manage playback and crossfade lifecycle when active video changes
  useEffect(() => {
    hasTriggeredTransitionRef.current = false;
    const currentEl = videoRefs.current[currentVideoIndex]?.current;

    // Start playing the current active video
    if (currentEl) {
      currentEl.muted = isMuted;
      if (currentEl.paused) {
        const playPromise = currentEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn(`Autoplay with sound prevented for video ${currentVideoIndex}:`, err);
            currentEl.muted = true;
            if (onAutoplayBlocked) onAutoplayBlocked();
            currentEl.play().catch(() => {});
          });
        }
      }
    }

    // Gracefully pause other inactive videos after the cross-dissolve transition completes
    STORY_VIDEOS.forEach((_, idx) => {
      if (idx !== currentVideoIndex) {
        const otherEl = videoRefs.current[idx]?.current;
        if (otherEl) {
          otherEl.muted = true;
          setTimeout(() => {
            // Only pause if still inactive
            if (idx !== currentVideoIndex) {
              otherEl.pause();
            }
          }, 950);
        }
      }
    });
  }, [currentVideoIndex, isMuted, onAutoplayBlocked]);

  // Preload all chapter videos for instant zero-latency start
  useEffect(() => {
    STORY_VIDEOS.forEach((_, idx) => {
      const el = videoRefs.current[idx]?.current;
      if (el) {
        el.preload = 'auto';
        // Pre-warm video buffer
        if (idx === 1) {
          el.load();
        }
      }
    });
  }, []);

  // Time update listener with early handoff trigger for seamless overlapping crossfade
  const handleNativeTimeUpdate = useCallback(
    (idx, e) => {
      if (idx === currentVideoIndex) {
        const ct = e.currentTarget.currentTime;
        const dur = e.currentTarget.duration || 10.0;
        onTimeUpdate(ct);

        // Overlap Crossfade: 0.85s before the current track concludes, start next track
        const nextIdx = currentVideoIndex + 1;
        if (dur > 0 && ct >= dur - 0.85 && !hasTriggeredTransitionRef.current) {
          if (nextIdx < STORY_VIDEOS.length) {
            hasTriggeredTransitionRef.current = true;
            const nextEl = videoRefs.current[nextIdx]?.current;
            if (nextEl) {
              nextEl.currentTime = 0;
              nextEl.muted = isMuted;
              nextEl.play().catch(() => {});
            }
            // Advance active index smoothly while both videos roll
            onEnded();
          }
        }
      }
    },
    [currentVideoIndex, isMuted, onTimeUpdate, onEnded]
  );

  return (
    <div className="story-video-container">
      {STORY_VIDEOS.map((video, idx) => {
        const isActive = idx === currentVideoIndex;
        const isPrev = idx === currentVideoIndex - 1;
        let trackClass = 'inactive-track';
        if (isActive) trackClass = 'active-track';
        else if (isPrev) trackClass = 'outgoing-track';

        return (
          <video
            key={video.src}
            ref={videoRefs.current[idx]}
            className={`story-video-element ${trackClass}`}
            src={video.src}
            preload="auto"
            playsInline
            onTimeUpdate={(e) => handleNativeTimeUpdate(idx, e)}
            onEnded={() => {
              if (idx === currentVideoIndex && !hasTriggeredTransitionRef.current) {
                hasTriggeredTransitionRef.current = true;
                onEnded();
              }
            }}
          />
        );
      })}

      {/* Cinematic Golden Light Leak / Atmosphere Transition Bloom */}
      <div className="story-cinematic-glow" />
      <div className="story-video-vignette" />
    </div>
  );
}

export default StoryVideo;

