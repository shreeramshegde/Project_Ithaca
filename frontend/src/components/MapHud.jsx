import JourneyYears from './JourneyYears.jsx';

function MapHud({ teamName, state, previousYears }) {
  const currentIslandName = state?.team?.current_island 
    ? `Island ${state.team.current_island}` 
    : 'Awaiting route';

  return (
    <div className="map-hud-overlay">
      <div className="map-hud-top-left">
        <p className="eyebrow">Project Ithaca</p>
        <h2 className="map-hud-title">{currentIslandName}</h2>
      </div>

      <div className="map-hud-top-center">
        <JourneyYears
          years={state?.team?.remaining_years}
          previousYears={previousYears}
        />
      </div>

      <div className="map-hud-top-right">
        <div className="map-hud-stats">
          <div className="stat-group">
            <span className="stat-label">Crew</span>
            <span className="stat-value">{teamName || 'Unnamed'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Hints</span>
            <span className="stat-value">{state?.team?.standard_hints_left ?? '--'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Inventory</span>
            <span className="stat-value">{state?.inventory?.length ?? 0}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default MapHud;
