import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { adjustYears, getLeaderboard } from '../api/admin.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

function AdminPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [submittedCredentials, setSubmittedCredentials] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({ team_id: '', adjustment: 0 });
  const [feedback, setFeedback] = useState(null);

  const leaderboardQuery = useQuery({
    queryKey: ['admin-leaderboard', submittedCredentials],
    queryFn: () => getLeaderboard(submittedCredentials),
    enabled: Boolean(submittedCredentials),
    refetchInterval: submittedCredentials ? 10000 : false,
  });

  const adjustMutation = useMutation({
    mutationFn: (payload) => adjustYears(submittedCredentials, payload),
    onSuccess: (payload) => {
      setFeedback({
        kind: 'success',
        title: 'Years adjusted',
        message: `${payload.data.team_name} now has ${payload.data.remaining_years} years remaining.`,
      });
      leaderboardQuery.refetch();
    },
    onError: (error) => {
      setFeedback({
        kind: 'error',
        title: 'Adjustment failed',
        message: error.message,
      });
    },
  });

  return (
    <main className="page-shell admin-page">
      <div className="page-content split-hero">
        <section className="surface-panel admin-auth-card">
          <p className="eyebrow">Admin Gate</p>
          <h1 className="display-title">Operations Console</h1>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedCredentials(credentials);
            }}
          >
            <div className="field">
              <label htmlFor="ops-user">Username</label>
              <input
                id="ops-user"
                value={credentials.username}
                onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="ops-pass">Password</label>
              <input
                id="ops-pass"
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                required
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
                title: 'Authentication failed',
                message: leaderboardQuery.error.message,
              }}
            />
          ) : null}
        </section>

        <section className="admin-tools">
          <section className="surface-panel admin-panel-card">
            <p className="eyebrow">Manual Score Control</p>
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
                <label htmlFor="team-id">Team UUID</label>
                <input
                  id="team-id"
                  value={adjustmentForm.team_id}
                  onChange={(event) => setAdjustmentForm((current) => ({ ...current, team_id: event.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="adjustment">Adjustment</label>
                <input
                  id="adjustment"
                  type="number"
                  step="0.1"
                  value={adjustmentForm.adjustment}
                  onChange={(event) =>
                    setAdjustmentForm((current) => ({ ...current, adjustment: event.target.value }))
                  }
                  required
                />
              </div>
              <button type="submit" className="secondary-button" disabled={!submittedCredentials || adjustMutation.isPending}>
                {adjustMutation.isPending ? 'Applying...' : 'Apply Adjustment'}
              </button>
            </form>
          </section>

          <section className="surface-panel admin-panel-card">
            <p className="eyebrow">Team Overview</p>
            <div className="admin-team-list">
              {(leaderboardQuery.data?.data || []).map((teamEntry) => (
                <article key={teamEntry.id} className="admin-team-row">
                  <div>
                    <h3>{teamEntry.team_name}</h3>
                    <p>{teamEntry.id}</p>
                  </div>
                  <div className="admin-team-meta">
                    <span>{Number(teamEntry.remaining_years).toFixed(2)} years</span>
                    <span>Island {teamEntry.current_island}</span>
                    <span>{teamEntry.standard_hints_left} hints left</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
