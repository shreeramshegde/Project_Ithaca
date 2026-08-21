import React, { useEffect, useState } from 'react';

/**
 * StoryTitle
 *
 * Renders prominent cinematic scene titles and island reveals (e.g. THE FALL OF TROY,
 * THE LOTUS, THE CYCLOPS, THE SIRENS, THE WITCH).
 */
function StoryTitle({ title }) {
  const [displayTitle, setDisplayTitle] = useState(title);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (title !== displayTitle) {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setDisplayTitle(title);
        setIsVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [title, displayTitle]);

  if (!displayTitle) return null;

  return (
    <div className="story-title-wrapper">
      <div className={`story-title-text ${isVisible ? 'visible' : 'hidden'}`}>
        <h2>{displayTitle}</h2>
      </div>
    </div>
  );
}

export default StoryTitle;
