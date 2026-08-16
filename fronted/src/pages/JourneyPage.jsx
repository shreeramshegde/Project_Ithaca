import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGame } from '../context/GameContext.jsx';
import MapHud from '../components/MapHud.jsx';
import OceanMap from '../components/OceanMap.jsx';
import RulesModal from '../components/common/RulesModal.jsx';
import { animateMapCamera } from '../animations/mapAnimations.js';
import '../journey-map.css';

export default function JourneyPage() {
  const navigate = useNavigate();
  const { team, clearSession } = useAuth();
  const { gameState } = useGame();
  const [rulesOpen, setRulesOpen] = useState(false);

  const currentIsland = gameState.current_island || 1;

  const handleIslandClick = (slug) => {
    animateMapCamera(slug);
    setTimeout(() => {
      if (slug === 'ithaca' || currentIsland > 4) {
        navigate('/victory');
      } else {
        navigate(`/journey/${slug}`);
      }
    }, 300);
  };

  return (
    <main className="page-shell journey-page-cinematic">
      <MapHud
        teamName={team?.team_name}
        state={gameState}
        previousYears={gameState.remaining_years}
        onOpenRules={() => setRulesOpen(true)}
      />

      <OceanMap
        currentIsland={currentIsland}
        onIslandClick={handleIslandClick}
      />

      <div className="map-bottom-controls">
        <button
          type="button"
          className="action-button cinematic-button map-quick-enter-btn"
          onClick={() => {
            const slugs = ['lotus', 'cyclops', 'sirens', 'witch', 'ithaca'];
            const targetSlug = slugs[Math.min(currentIsland - 1, 4)];
            handleIslandClick(targetSlug);
          }}
        >
          <span>⚔️</span>
          Enter Active Island Trial
          <span>⚔️</span>
        </button>

        <button
          type="button"
          className="ghost-button cinematic-button"
          onClick={() => setRulesOpen(true)}
        >
          📜 Rules Reference
        </button>

        <button
          type="button"
          className="ghost-button cinematic-button"
          onClick={clearSession}
        >
          Logout
        </button>
      </div>

      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </main>
  );
}
