import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
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

  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const panelRef = useRef(null);

  // GSAP stagger entry — editorial feel, nothing bounces, everything breathes
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set([headlineRef.current, panelRef.current], { autoAlpha: 0, y: 28 });

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(headlineRef.current, { autoAlpha: 1, y: 0, duration: 1.0 }, 0.15)
        .to(panelRef.current, { autoAlpha: 1, y: 0, duration: 0.95 }, 0.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const registerMutation = useMutation({
    mutationFn: registerTeam,
    onSuccess: (payload) => {
      saveSession({
        token: payload.token,
        team: payload.data,
      });
      const isReturning = payload?.message?.toLowerCase().includes('welcome back');
      setFeedback({
        kind: 'success',
        title: isReturning ? 'Crew recognized' : '20 years remain',
        message: isReturning
          ? 'Welcome back. The passage opens in a moment.'
          : 'Your crew is registered. The passage opens in a moment.',
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
            ? 'That team name or code is already in use. Returning crews must enter the same name and code together.'
            : error.message,
      });
      // Shake the panel on error
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { x: -6 },
          { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
        );
      }
    },
  });

  const queryParams = new URLSearchParams(location.search);
  const shouldClear = queryParams.get('clear') === 'true';

  useEffect(() => {
    if (shouldClear) {
      window.localStorage.removeItem('ithaca-team-session');
      window.location.href = '/login';
    } else if (isAuthenticated) {
      navigate('/journey', { replace: true });
    }
  }, [isAuthenticated, navigate, shouldClear]);

  return (
    <main className="page-shell auth-page" ref={containerRef}>
      <div className="page-content split-hero">
        <section className="login-ambient ocean-copy" ref={headlineRef}>
          <p className="eyebrow">Embarkation</p>
          <h1 className="display-title">
            Mark the crew.<br />Step into the waterline.
          </h1>
          <div className="ambient-stateline">
            <span />
            <span />
            <span />
          </div>
          <p className="ambient-copy login-lore">
            The Aegean awaits. Register your team name and a secret code — remember them well.
            The islands do not forget those who enter.
          </p>
        </section>

        <section className="surface-panel login-panel" ref={panelRef}>
          <p className="eyebrow">Team Registration</p>
          <h2 className="login-panel-title">Begin Journey</h2>
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
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="auth-code">Team Code</label>
              <input
                id="auth-code"
                type="password"
                value={form.auth_code}
                onChange={(event) => setForm((current) => ({ ...current, auth_code: event.target.value }))}
                placeholder="Your secret code"
                required
                minLength={4}
                autoComplete="new-password"
              />
            </div>

            <button className="action-button login-submit-btn" type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Opening Passage...' : 'Begin Journey'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
