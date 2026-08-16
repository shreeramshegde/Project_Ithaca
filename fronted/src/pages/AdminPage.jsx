import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard, adjustYears } from '../api/admin.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { ISLANDS } from '../data/islands.js';

// Default initial leaderboard for event projector simulation
const INITIAL_MOCK_TEAMS = [
  { id: 'team-1', team_name: 'The Argonauts', remaining_years: '12.50', current_island: 4, standard_hints_left: 2, duration_seconds: 2700, is_completed: false },
  { id: 'team-2', team_name: 'Spartan Legion', remaining_years: '14.00', current_island: 3, standard_hints_left: 3, duration_seconds: 2850, is_completed: false },
  { id: 'team-3', team_name: 'Oracle of Delphi', remaining_years: '15.50', current_island: 3, standard_hints_left: 1, duration_seconds: 2900, is_completed: false },
  { id: 'team-4', team_name: 'Achilles Heel', remaining_years: '16.00', current_island: 2, standard_hints_left: 2, duration_seconds: 3100, is_completed: false },
  { id: 'team-5', team_name: 'Titans of Troy', remaining_years: '17.50', current_island: 2, standard_hints_left: 0, duration_seconds: 3300, is_completed: false },
  { id: 'team-6', team_name: 'Minotaur Maze', remaining_years: '19.00', current_island: 1, standard_hints_left: 3, duration_seconds: 3400, is_completed: false },
  { id: 'team-7', team_name: 'Pegasus Flight', remaining_years: '20.00', current_island: 1, standard_hints_left: 3, duration_seconds: 3500, is_completed: false },
  { id: 'team-8', team_name: 'Poseidon Wave', remaining_years: '21.50', current_island: 1, standard_hints_left: 2, duration_seconds: 3600, is_completed: false },
  { id: 'team-9', team_name: 'Olympus Dawn', remaining_years: '22.00', current_island: 1, standard_hints_left: 1, duration_seconds: 3650, is_completed: false },
  { id: 'team-10', team_name: 'Cyclops Stride', remaining_years: '24.00', current_island: 1, standard_hints_left: 0, duration_seconds: 3800, is_completed: false },
];

export default function AdminPage() {
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'password' });
  const [teams, setTeams] = useState(INITIAL_MOCK_TEAMS);
  const [selectedTeamId, setSelectedTeamId] = useState(INITIAL_MOCK_TEAMS[0].id);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Poll backend if available
  useEffect(() => {
    let timer;
    const fetchLive = async () => {
      try {
        const res = await getLeaderboard(credentials);
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setTeams(res.data);
          setIsLiveApi(true);
        }
      } catch {
        setIsLiveApi(false);
      }
    };

    fetchLive();
    timer = setInterval(fetchLive, 5000);
    return () => clearInterval(timer);
  }, [credentials]);

  // Sort teams according to official tie-breaker rules
  const sortedTeams = [...teams].sort((a, b) => {
    // 1. Remaining years (ASC - lowest wins)
    const yearDiff = parseFloat(a.remaining_years) - parseFloat(b.remaining_years);
    if (Math.abs(yearDiff) > 0.001) return yearDiff;

    // 2. Duration (ASC - fastest wins)
    const durA = Number(a.duration_seconds || 99999);
    const durB = Number(b.duration_seconds || 99999);
    if (durA !== durB) return durA - durB;

    // 3. Standard hints left (DESC - highest wins)
    return Number(b.standard_hints_left || 0) - Number(a.standard_hints_left || 0);
  });

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(adjustAmount);
    if (isNaN(val) || val === 0) return;

    // Try live backend
    try {
      if (isLiveApi) {
        await adjustYears(credentials, { team_id: selectedTeamId, adjustment: val });
      }
    } catch {
      // ignore
    }

    // Update local state
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === selectedTeamId) {
          const nextYears = Math.max(0, parseFloat((parseFloat(t.remaining_years) + val).toFixed(2))).toFixed(2);
          return { ...t, remaining_years: nextYears };
        }
        return t;
      })
    );

    const targetTeam = teams.find((t) => t.id === selectedTeamId);
    setFeedback({
      kind: 'success',
      title: 'Score Adjusted',
      message: `Applied ${val > 0 ? `+${val}` : val} years adjustment to ${targetTeam?.team_name || 'team'}.`,
    });
    setAdjustAmount(0);
  };

  return (
    <main className="page-shell admin-page">
      <div className="admin-projector-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-brand">
            <span className="gold-sparkle">✦</span>
            <div>
              <p className="eyebrow" style={{ color: '#c6a56a' }}>NISB IEEE &bull; Sir MV Hall</p>
              <h1 className="admin-title">PROJECT ITHACA — LIVE LEADERBOARD</h1>
            </div>
          </div>
          <div className="admin-header-actions">
            <span className={`live-tag ${isLiveApi ? 'online' : 'demo'}`}>
              ● {isLiveApi ? 'Live Backend Connected' : 'Projector Standalone Mode'}
            </span>
            <Link to="/journey" className="ghost-button cinematic-button small-btn">
              🗺️ Ocean Map
            </Link>
          </div>
        </header>

        <FeedbackBanner result={feedback} />

        <div className="admin-content-grid">
          {/* Main Ranked Table (Designed for Large Projector Display) */}
          <section className="surface-panel leaderboard-panel cinematic-panel">
            <div className="panel-title-row">
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem' }}>Official Fleet Standings</h3>
              <span className="tie-breaker-legend">
                Sorted by: Lowest Years &rarr; Fastest Duration &rarr; Hints Left
              </span>
            </div>

            <div className="leaderboard-table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Rank</th>
                    <th>Navigator Crew</th>
                    <th style={{ textAlign: 'center' }}>Stage</th>
                    <th style={{ textAlign: 'center' }}>Hints Left</th>
                    <th style={{ textAlign: 'right' }}>Remaining Journey</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((teamEntry, index) => {
                    const rank = index + 1;
                    const islandMeta = ISLANDS.find((i) => i.id === teamEntry.current_island);
                    const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : '';

                    return (
                      <tr key={teamEntry.id} className={`leaderboard-row ${rankClass}`}>
                        <td className="rank-cell">
                          <span className={`rank-badge ${rankClass}`}>
                            {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
                          </span>
                        </td>
                        <td className="team-cell">
                          <strong>{teamEntry.team_name}</strong>
                          <span className="team-id-sub">{teamEntry.id}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="island-pill">
                            {teamEntry.current_island > 4 ? '⚓ Ithaca' : `🏝️ ${islandMeta?.name || `Island ${teamEntry.current_island}`}`}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="hints-pill">{teamEntry.standard_hints_left} / 3</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <strong className="years-display">
                            {Number(teamEntry.remaining_years).toFixed(2)}
                          </strong>
                          <span className="years-label">Years</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Judges Control & Manual Override Console */}
          <aside className="surface-panel judge-console cinematic-panel">
            <p className="eyebrow" style={{ color: '#c6a56a' }}>Organizer / Judge Override</p>
            <h3 style={{ fontFamily: 'var(--display)', marginBottom: '1rem' }}>Manual Year Adjustment</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.25rem' }}>
              Used by judges to manually award bonuses or apply penalties in case of physical sit-out disputes or volunteer verification.
            </p>

            <form className="form-grid cinematic-form" onSubmit={handleAdjustSubmit}>
              <div className="field">
                <label htmlFor="team-select">Select Team</label>
                <select
                  id="team-select"
                  className="cinematic-input"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.team_name} ({Number(t.remaining_years).toFixed(2)} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="adjust-input">Years Adjustment (+ / −)</label>
                <input
                  id="adjust-input"
                  type="number"
                  step="0.5"
                  className="cinematic-input"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. -2.0 for bonus, +1.5 for penalty"
                  required
                />
                <small style={{ opacity: 0.7 }}>Negative value deducts years; positive value adds years.</small>
              </div>

              <button className="action-button cinematic-button" type="submit" style={{ marginTop: '0.5rem' }}>
                Apply Judge Override
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
