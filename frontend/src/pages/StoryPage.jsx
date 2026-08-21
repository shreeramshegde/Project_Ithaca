import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CinematicStory from '../components/story/CinematicStory.jsx';

/**
 * StoryPage
 *
 * Dedicated page for the full 5-chapter Cinematic Story Introduction.
 * Shown after clicking "Enter The Odyssey" from the Landing Page.
 * On completion or skip, smoothly navigates into Registration (/login) or Game (/journey).
 */
function StoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStoryComplete = () => {
    if (isAuthenticated) {
      navigate('/journey');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="page-shell story-page-shell">
      <CinematicStory onComplete={handleStoryComplete} />
    </main>
  );
}

export default StoryPage;
