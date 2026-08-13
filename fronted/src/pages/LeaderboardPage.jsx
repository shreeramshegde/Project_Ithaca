import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../api/admin.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) {
    return '--';
  }

  const total = Math.max(0, Math.floor(Number(seconds)));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function LeaderboardPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [submittedCredentials, setSubmittedCredentials] = useState(null);

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', submittedCredentials],
    queryFn: () => getLeaderboard(submittedCredentials),
    enabled: Boolean(submittedCredentials),
    refetchInterval: submittedCredentials ? 10000 : false,
  });

  const rows = useMemo(() => leaderboardQuery.data?.data || [], [leaderboardQuery.data?.data]);

  return (
    <main className="page-shell leaderboard-page">
      <div className="page-content leaderboard-layout">
        <section className="leaderboard-header">
          <p className="eyebrow">Projector View</p>
          <h1 className="display-title">Live Leaderboard</h1>
          <p>
            This page honors the backend ordering directly. Since `/api/admin/leaderboard` is protected with Basic
            Auth, projector or operations staff can unlock polling here without changing backend code.
          </p>
          <Link className="ghost-button" to="/">
            Return to Landing
          </Link>
        </section>

        <section className="surface-panel leaderboard-auth">
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedCredentials(credentials);
            }}
          >
            <div className="field">
              <label htmlFor="admin-user">Admin Username</label>
              <input
                id="admin-user"
                value={credentials.username}
                onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="admin-pass">Admin Password</label>
              <input
                id="admin-pass"
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </div>
            <button type="submit" className="action-button" disabled={leaderboardQuery.isFetching}>
              {leaderboardQuery.isFetching ? 'Connecting...' : 'Unlock Leaderboard'}
            </button>
          </form>
        </section>

        {leaderboardQuery.isError ? (
          <FeedbackBanner
            result={{
              kind: 'error',
              title: 'Leaderboard unavailable',
              message: leaderboardQuery.error.message,
            }}
          />
        ) : null}

        <section className="surface-panel leaderboard-table-card">
          <div className="leaderboard-table">
            <div className="leaderboard-row leaderboard-head">
              <span>Rank</span>
              <span>Team</span>
              <span>Years Remaining</span>
              <span>Completion Time</span>
              <span>Hints Left</span>
            </div>

            {rows.length ? (
              rows.map((entry, index) => (
                <div key={entry.id} className="leaderboard-row">
                  <span>#{index + 1}</span>
                  <span>{entry.team_name}</span>
                  <span>{Number(entry.remaining_years).toFixed(2)}</span>
                  <span>{formatDuration(entry.duration_seconds)}</span>
                  <span>{entry.standard_hints_left}</span>
                </div>
              ))
            ) : (
              <div className="leaderboard-empty">
                <p>No leaderboard data yet. Enter valid admin credentials to start polling the backend.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default LeaderboardPage;
