import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { animateMapCamera } from '../animations/mapAnimations.js';
import { getGameState } from '../api/game.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import MapHud from '../components/MapHud.jsx';
import OceanMap from '../components/OceanMap.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../journey-map.css'; // Import map styles

function JourneyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, team, clearSession } = useAuth();
  const [previousYears, setPreviousYears] = useState(team?.remaining_years ?? null);
  const traveledFrom = location.state?.traveledFrom;

  const stateQuery = useQuery({
    queryKey: ['game-state', token],
    queryFn: () => getGameState(token),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (stateQuery.error?.message === 'Invalid or expired token') {
      clearSession();
    }
  }, [clearSession, stateQuery.error?.message]);

  useEffect(() => {
    const currentYears = stateQuery.data?.data?.team?.remaining_years;
    if (currentYears !== undefined) {
      setPreviousYears((current) => (current === null ? currentYears : current));
    }
  }, [stateQuery.data?.data?.team?.remaining_years]);

  const handleIslandClick = (slug) => {
    animateMapCamera(slug);
    // Allow the camera animation to begin, then navigate reliably
    setTimeout(() => {
      navigate(`/journey/${slug}`);
    }, 300);
  };

  return (
    <main className="page-shell journey-page-cinematic">
      <MapHud
        teamName={team?.team_name}
        state={stateQuery.data?.data}
        previousYears={previousYears}
        onLogout={clearSession}
      />
      
      {stateQuery.isError && (
        <div style={{ position: 'absolute', top: 100, left: 40, right: 40, zIndex: 10 }}>
          <FeedbackBanner
            result={{
              kind: 'error',
              title: 'Unable to load journey state',
              message: stateQuery.error.message,
            }}
          />
        </div>
      )}

      <OceanMap 
        currentIsland={stateQuery.data?.data?.team?.is_completed ? 5 : stateQuery.data?.data?.team?.current_island} 
        traveledFrom={traveledFrom}
        onIslandClick={handleIslandClick}
      />
    </main>
  );
}

export default JourneyPage;
