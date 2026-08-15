import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerTeam } from '../api/auth.js';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveSession, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ team_name: '', auth_code: '' });
  const [feedback, setFeedback] = useState(null);

  const registerMutation = useMutation({
    mutationFn: registerTeam,
    onSuccess: (payload) => {
      saveSession({
        token: payload.token,
        team: payload.data,
      });
      setFeedback({
        kind: 'success',
        title: '20 years remain',
        message: 'The backend session is stored locally. Your crew is ready to enter the map.',
      });
      const target = location.state?.from || '/journey';
      window.setTimeout(() => navigate(target), 900);
    },
    onError: (error) => {
      setFeedback({
        kind: 'error',
        title: 'Unable to begin journey',
        message:
          error.message === 'Team name or Auth code already exists'
            ? 'This backend only exposes registration right now, so existing teams must continue from the saved browser session token.'
            : error.message,
      });
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/journey', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="page-shell auth-page">
      <div className="page-content split-hero">
        <section className="login-ambient ocean-copy">
          <p className="eyebrow">Embarkation</p>
          <h1 className="display-title">Mark the Crew and Step Into the Waterline</h1>
          <p className="ambient-copy">
            The current backend supports team registration plus JWT session restoration, not a separate login endpoint.
            This page therefore starts a new team session exactly as the backend expects and preserves it locally for
            refresh-safe gameplay.
          </p>
          <div className="ambient-stateline">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="surface-panel login-panel">
          <p className="eyebrow">Team Registration</p>
          <h2>Begin Journey</h2>
          <FeedbackBanner result={feedback} />
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setFeedback(null);
              registerMutation.mutate(form);
            }}
          >
            <div className="field">
              <label htmlFor="team-name">Team Name</label>
              <input
                id="team-name"
                value={form.team_name}
                onChange={(event) => setForm((current) => ({ ...current, team_name: event.target.value }))}
                placeholder="The Argonauts"
                required
                minLength={3}
              />
            </div>

            <div className="field">
              <label htmlFor="auth-code">Team Code</label>
              <input
                id="auth-code"
                value={form.auth_code}
                onChange={(event) => setForm((current) => ({ ...current, auth_code: event.target.value }))}
                placeholder="secretCode123"
                required
                minLength={4}
              />
            </div>

            <button className="action-button" type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Beginning Journey...' : 'Begin Journey'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
