import React, { useEffect, useState } from 'react';

/**
 * StoryCaption
 *
 * Renders the synchronized narrative story caption at the safe-zone bottom (8-12%).
 * Features smooth fade-in + slight upward movement and a soft backdrop gradient for legibility.
 */
function StoryCaption({ caption }) {
  const [displayCaption, setDisplayCaption] = useState(caption);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (caption !== displayCaption) {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setDisplayCaption(caption);
        setIsVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [caption, displayCaption]);

  if (!displayCaption) return null;

  return (
    <div className="story-caption-wrapper">
      <div className={`story-caption-text ${isVisible ? 'visible' : 'hidden'}`}>
        <p>{displayCaption}</p>
      </div>
    </div>
  );
}

export default StoryCaption;
