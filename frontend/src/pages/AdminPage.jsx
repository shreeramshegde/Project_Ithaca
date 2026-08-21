import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { adjustYears, getLeaderboard } from '../api/admin.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

function AdminPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [submittedCredentials, setSubmittedCredentials] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({ team_id: '', team_name: '', adjustment: 0 });
  const [searchFilter, setSearchFilter] = useState('');
  const [feedback, setFeedback] = useState(null);

  const leaderboardQuery = useQuery({
    queryKey: ['admin-leaderboard', submittedCredentials],
    queryFn: () => getLeaderboard(submittedCredentials),
    enabled: Boolean(submittedCredentials),
    refetchInterval: submittedCredentials ? 8000 : false,
  });

  const rawTeams = leaderboardQuery.data?.data;
  const teams = useMemo(() => rawTeams || [], [rawTeams]);

  const filteredTeams = useMemo(() => {
    if (!searchFilter.trim()) return teams;
    const q = searchFilter.toLowerCase();
    return teams.filter(
      (t) =>
        t.team_name?.toLowerCase().includes(q) ||
        String(t.id ?? '').toLowerCase().includes(q) ||
        `island ${t.current_island}`.includes(q)
    );
  }, [teams, searchFilter]);

  const adjustMutation = useMutation({
    mutationFn: (payload) => adjustYears(submittedCredentials, payload),
    onSuccess: (payload) => {
      setFeedback({
        kind: 'success',
        title: 'Years Adjusted',
        message: `${payload.data.team_name} now has ${Number(payload.data.remaining_years).toFixed(2)} years remaining.`,
      });
      leaderboardQuery.refetch();
    },
    onError: (error) => {
      setFeedback({
        kind: 'error',
        title: 'Adjustment Failed',
        message: error.message,
      });
    },
  });

  const handleSelectTeam = (team) => {
    setAdjustmentForm((prev) => ({
      ...prev,
      team_id: team.id,
      team_name: team.team_name,
    }));
  };

  return (
    <main className="page-shell admin-page">
      <div className="page-content split-hero">
        <section className="surface-panel admin-auth-card">
          <p className="eyebrow">Admin Command</p>
          <h1 className="display-title">Operations Console</h1>
          
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedCredentials(credentials);
            }}
          >
            <div className="field">
              <label htmlFor="ops-user">Officer Username</label>
              <input
                id="ops-user"
                value={credentials.username}
                onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
                required
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label htmlFor="ops-pass">Security Key / Password</label>
              <input
                id="ops-pass"
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="action-button" disabled={leaderboardQuery.isFetching}>
              {leaderboardQuery.isFetching ? 'Authenticating...' : 'Access Admin APIs'}
            </button>
          </form>

          <FeedbackBanner result={feedback} />
          {leaderboardQuery.isError ? (
            <FeedbackBanner
              result={{
                kind: 'error',
                title: 'Authentication Failed',
                message: leaderboardQuery.error.message,
              }}
            />
          ) : null}

          {/* Quick manual adjustment panel */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(198, 165, 106, 0.2)' }}>
            <p className="eyebrow">Manual Score Override</p>
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                adjustMutation.mutate({
                  team_id: adjustmentForm.team_id,
                  adjustment: Number(adjustmentForm.adjustment),
                });
              }}
            >
              <div className="field">
                <label htmlFor="team-id">
                  Target Team {adjustmentForm.team_name ? `(${adjustmentForm.team_name})` : ''}
                </label>
                <input
                  id="team-id"
                  placeholder="Select a team from list or paste UUID"
                  value={adjustmentForm.team_id}
                  onChange={(event) => setAdjustmentForm((current) => ({ ...current, team_id: event.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="adjustment">Years Adjustment (+ to add penalty, - to grant reward)</label>
                <input
                  id="adjustment"
                  type="number"
                  step="0.1"
                  placeholder="e.g. -1.5 or +2.0"
                  value={adjustmentForm.adjustment}
                  onChange={(event) =>
                    setAdjustmentForm((current) => ({ ...current, adjustment: event.target.value }))
                  }
                  required
                />
              </div>
              <button 
                type="submit" 
                className="secondary-button" 
                disabled={!submittedCredentials || adjustMutation.isPending || !adjustmentForm.team_id}
              >
                {adjustMutation.isPending ? 'Applying...' : 'Apply Year Adjustment'}
              </button>
            </form>
          </div>
        </section>

        <section className="admin-tools">
          <section className="surface-panel admin-panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>Live Leaderboard</p>
                <h2 style={{ fontFamily: 'var(--display)', margin: '4px 0 0 0', color: 'var(--cloud-white)', fontSize: '1.4rem' }}>
                  Voyage Standings
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="island-badge-pill">
                  {teams.length} Teams Registered
                </span>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="admin-search-bar">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search teams by name, island, or UUID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--cloud-white)',
                    borderRadius: '8px',
                    padding: '0 12px'
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Teams List */}
            <div className="admin-team-list" style={{ maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((teamEntry, index) => {
                  const isSelected = adjustmentForm.team_id === teamEntry.id;
                  let rankClass = 'rank-other';
                  let rankContent = `${index + 1}`;

                  if (index === 0) {
                    rankClass = 'rank-1';
                    rankContent = '🥇';
                  } else if (index === 1) {
                    rankClass = 'rank-2';
                    rankContent = '🥈';
                  } else if (index === 2) {
                    rankClass = 'rank-3';
                    rankContent = '🥉';
                  }

                  return (
                    <article 
                      key={teamEntry.id} 
                      className="admin-table-row"
                      style={{
                        borderColor: isSelected ? 'var(--gold)' : undefined,
                        boxShadow: isSelected ? '0 0 15px rgba(198, 165, 106, 0.3)' : undefined,
                      }}
                      onClick={() => handleSelectTeam(teamEntry)}
                      title="Click to select team for score adjustment"
                    >
                      <div>
                        <span className={`rank-badge ${rankClass}`}>{rankContent}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--cloud-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {teamEntry.team_name}
                        </h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'rgba(231, 229, 221, 0.45)', fontFamily: 'var(--mono)' }}>
                          {teamEntry.id.substring(0, 18)}...
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: 'var(--gold)', fontSize: '0.95rem' }}>
                          {Number(teamEntry.remaining_years).toFixed(2)}y
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          borderRadius: '10px',
                          background: teamEntry.is_completed ? 'rgba(137, 171, 118, 0.2)' : 'rgba(198, 165, 106, 0.15)',
                          color: teamEntry.is_completed ? 'var(--success)' : 'var(--cloud-white)'
                        }}>
                          {teamEntry.is_completed ? 'Ithaca' : `Isl. ${teamEntry.current_island}`}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="action-button"
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            background: isSelected ? 'var(--gold)' : 'rgba(198, 165, 106, 0.15)',
                            color: isSelected ? 'var(--midnight)' : 'var(--gold)',
                            border: '1px solid var(--gold)',
                            borderRadius: '4px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTeam(teamEntry);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="muted-copy" style={{ textAlign: 'center', padding: '24px 0' }}>
                  {submittedCredentials ? 'No teams matched your search.' : 'Authenticate above to view real-time standings.'}
                </p>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
