import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { animateMapCamera } from '../animations/mapAnimations.js';
import { getGameState } from '../api/game.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import MapHud from '../components/MapHud.jsx';
import OceanMap from '../components/OceanMap.jsx';
import VictoryCelebrationModal from '../components/VictoryCelebrationModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ISLANDS } from '../data/islands.js';
import '../journey-map.css';

function JourneyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, team, clearSession } = useAuth();
  const [previousYears, setPreviousYears] = useState(team?.remaining_years ?? null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [hasDismissedVictory, setHasDismissedVictory] = useState(false);

  const stateQuery = useQuery({
    queryKey: ['game-state', token],
    queryFn: () => getGameState(token),
    enabled: Boolean(token),
    refetchInterval: 10000,
  });

  const isCompleted = Boolean(stateQuery.data?.data?.team?.is_completed);
  const currentIsland = stateQuery.data?.data?.team?.is_completed
    ? 5
    : stateQuery.data?.data?.team?.current_island || 1;

  // Extract voyage state passed from IslandPage
  const voyageState = location.state?.voyage;
  const traveledFrom = location.state?.traveledFrom;

  const voyage = React.useMemo(() => {
    if (voyageState && voyageState.fromId && voyageState.toId) {
      return voyageState;
    }
    if (traveledFrom && traveledFrom !== currentIsland) {
      const destIsland = ISLANDS.find((i) => i.id === currentIsland) || ISLANDS[0];
      return {
        fromId: traveledFrom,
        toId: currentIsland,
        toSlug: destIsland.slug,
      };
    }
    return null;
  }, [voyageState, traveledFrom, currentIsland]);

  useEffect(() => {
    if (isCompleted && !hasDismissedVictory) {
      setShowVictoryModal(true);
    }
  }, [isCompleted, hasDismissedVictory]);

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
    setTimeout(() => {
      navigate(`/journey/${slug}`);
    }, 450);
  };

  // Called when the ship reaches the destination island
  const handleVoyageArrival = () => {
    if (voyage?.toSlug) {
      const destinationSlug = voyage.toSlug;
      
      // Clear location state
      try {
        if (window.history.replaceState) {
          window.history.replaceState({}, document.title);
        }
      } catch {
        // Ignore history errors
      }

      // Savor arrival for 1.1s with newly unlocked island, then seamlessly transition
      setTimeout(() => {
        handleIslandClick(destinationSlug);
      }, 1100);
    }
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
        <div style={{ position: 'fixed', top: 100, left: 40, right: 40, zIndex: 100 }}>
          <FeedbackBanner
            result={{
              kind: 'error',
              title: 'Unable to load journey state',
              message: stateQuery.error.message,
            }}
          />
        </div>
      )}

      {/* Floating Victory Re-Open Pill when game is completed */}
      {isCompleted && !showVictoryModal && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            cursor: 'pointer'
          }}
          onClick={() => setShowVictoryModal(true)}
        >
          <div className="victory-floating-pill">
            <span>👑</span>
            <span>Odyssey Completed · View Victory Summary</span>
          </div>
        </div>
      )}

      {showVictoryModal && (
        <VictoryCelebrationModal
          state={stateQuery.data?.data}
          onClose={() => {
            setShowVictoryModal(false);
            setHasDismissedVictory(true);
          }}
          onNavigateIthaca={() => handleIslandClick('ithaca')}
        />
      )}

      <OceanMap 
        currentIsland={currentIsland}
        voyage={voyage}
        onVoyageArrival={handleVoyageArrival}
        onIslandClick={handleIslandClick}
      />
    </main>
  );
}

export default JourneyPage;
