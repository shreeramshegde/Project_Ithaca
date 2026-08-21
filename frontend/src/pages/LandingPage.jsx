import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runDepartureAnimation, runLandingAnimation } from '../animations/landingAnimations.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import './LandingPage.css';
import backgroundVideo from '../animations/landing_background.mp4';

function LandingPage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [isDeparting, setIsDeparting] = useState(false);

  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const vignetteRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const quoteRef = useRef(null);
  const actionsRef = useRef(null);
  const marqueeRef = useRef(null);

  const refs = {
    video: videoRef,
    overlay: overlayRef,
    vignette: vignetteRef,
    title: titleRef,
    subtitle: subtitleRef,
    quote: quoteRef,
    actions: actionsRef,
  };

  useEffect(() => runLandingAnimation(refs, reducedMotion), [reducedMotion]);

  const handleEnter = () => {
    setIsDeparting(true);
    const timeline = runDepartureAnimation(refs, reducedMotion);
    timeline.eventCallback('onComplete', () => {
      setTimeout(() => navigate('/story'), 400);
    });
    if (reducedMotion) {
      navigate('/story');
    }
  };

  const MARQUEE_ITEMS = [
    'Four Islands', 'One Journey Home', 'Lotus', 'Cyclops', 'Sirens', 'Circe',
    'Four Islands', 'One Journey Home', 'Lotus', 'Cyclops', 'Sirens', 'Circe',
  ];

  return (
    <main className="page-shell landing-page">
      {/* Cinematic video background */}
      <div className="landing-video-wrap" aria-hidden="true">
        <div className="video-cropper">
          <video
            ref={videoRef}
            className="landing-video"
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="landing-overlay" ref={overlayRef} />
        <div className="landing-vignette" ref={vignetteRef} />
      </div>

      {/* Top navigation bar */}
      <header className="landing-topbar">
        <div className="landing-topbar-left">
          <img
            src="/assets/landing/nie_ieee_branch.svg"
            alt="NIE IEEE Student Branch"
            className="nie-ieee-logo"
          />
          <p className="topbar-brand">NIE IEEE Student Branch</p>
        </div>

        <div className="landing-topbar-right">
          <img
            src="/assets/landing/ieee_logo.svg"
            alt="IEEE"
            className="ieee-topbar-logo"
          />
        </div>
      </header>

      {/* Hero — Cinematic Center */}
      <div className="landing-content">
        <section className="landing-stage">
          <div className="landing-copy">
            <p ref={subtitleRef} className="landing-kicker">
              The Tech Odyssey
            </p>
            <h1 ref={titleRef} className="display-title landing-heading">
              Project Ithaca
            </h1>
            <p ref={quoteRef} className="landing-quote">
              Four trials. One journey home.
            </p>
            <div ref={actionsRef} className="landing-actions">
              <button
                type="button"
                className="enter-button"
                disabled={isDeparting}
                onClick={handleEnter}
              >
                <span>{isDeparting ? 'Opening Passage...' : 'Enter The Odyssey'}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Infinite marquee — docked to bottom */}
      <div className="landing-marquee-wrap" aria-hidden="true" ref={marqueeRef}>
        <div className="landing-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="landing-marquee-item">
              {item}
              <span className="landing-marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
