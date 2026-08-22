import React, { useState, useMemo, useCallback } from 'react';
import { STORY_VIDEOS, STORY_TIMELINE } from '../../data/storyTimeline.js';
import StoryVideo from './StoryVideo.jsx';
import StoryCaption from './StoryCaption.jsx';
import StoryTitle from './StoryTitle.jsx';
import StoryControls from './StoryControls.jsx';
import StoryProgress from './StoryProgress.jsx';
import StoryBridge from './StoryBridge.jsx';
import './CinematicStory.css';

/**
 * CinematicStory
 *
 * Central story sequence controller orchestrating the 5-video cinematic introduction:
 * 1. The Fall of Troy
 * 2. The Journey Home
 * 3. The Storm
 * 4. The Four Trials (Lotus, Cyclops, Sirens, Witch)
 * 5. Project Ithaca Reveal & Call to Adventure
 *
 * Smooth continuous playback with zero black cuts, embedded audio, rewind controls, and skip.
 */
function CinematicStory({ onComplete }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('ithaca_story_muted');
    return saved === 'true'; // Defaults to false (unmuted audio)
  });

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('ithaca_story_muted', String(next));
      return next;
    });
  }, []);

  const handleAutoplayBlocked = useCallback(() => {
    setIsMuted(true);
  }, []);

  const currentVideo = STORY_VIDEOS[currentVideoIndex];

  // Resolve current active caption & title from timeline
  const activeScene = useMemo(() => {
    const match = STORY_TIMELINE.find(
      (item) =>
        item.videoIndex === currentVideoIndex &&
        currentTime >= item.start &&
        currentTime < item.end
    );
    return match || null;
  }, [currentVideoIndex, currentTime]);

  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (currentVideoIndex < STORY_VIDEOS.length - 1) {
      // Seamless advance to next video track with smooth cross-dissolve
      setCurrentVideoIndex((prev) => prev + 1);
      setCurrentTime(0);
    } else {
      // Reached the end of Video 5 -> transition to StoryBridge
      setIsTransitioning(true);
      setTimeout(() => {
        setIsStoryComplete(true);
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentVideoIndex]);

  const handleRewind = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex(0);
      setCurrentTime(0);
      setIsStoryComplete(false);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleSkip = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsStoryComplete(true);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const handleBeginJourney = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  if (isStoryComplete) {
    return (
      <StoryBridge
        onBeginJourney={handleBeginJourney}
        onRewatch={handleRewind}
      />
    );
  }

  return (
    <div className="cinematic-story-shell">
      {/* Seamless Multi-Track Video Player with Cross-Dissolve */}
      <StoryVideo
        currentVideoIndex={currentVideoIndex}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        isTransitioning={isTransitioning}
        isMuted={isMuted}
        onAutoplayBlocked={handleAutoplayBlocked}
      />

      {/* Cinematic Scene Title Overlay */}
      <StoryTitle title={activeScene?.title || ''} />

      {/* Synchronized Narrative Captions at Safe-Zone Bottom */}
      <StoryCaption caption={activeScene?.caption || ''} />

      {/* HUD Controls (Sound Toggle + Skip Story) */}
      <StoryControls
        onSkip={handleSkip}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Subtle Bronze Timeline Progress */}
      <StoryProgress
        currentVideoIndex={currentVideoIndex}
        currentTime={currentTime}
        totalVideos={STORY_VIDEOS.length}
        videoDuration={currentVideo.duration}
      />

      {/* Optional Subtle Transition Veil */}
      <div className={`story-transition-veil ${isTransitioning ? 'active' : ''}`} />
    </div>
  );
}

export default CinematicStory;
