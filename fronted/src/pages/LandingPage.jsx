import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RulesModal from '../components/common/RulesModal.jsx';
import { ISLANDS } from '../data/islands.js';
import './LandingPage.css';

function LandingPage() {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <main className="ithaca-landing">
      {/* Atmospheric background */}
      <div className="sky-glow" />
      <div className="map-lines" />
      <div className="stars" />

      {/* Ocean waves */}
      <div className="ocean">
        <div className="wave wave-one" />
        <div className="wave wave-two" />
        <div className="wave wave-three" />
      </div>

      {/* Left compass */}
      <div className="compass compass-left">
        <div className="compass-ring ring-one" />
        <div className="compass-ring ring-two" />
        <div className="compass-needle" />
        <span className="north">N</span>
        <span className="south">S</span>
        <span className="east">E</span>
        <span className="west">W</span>
      </div>

      {/* Right compass */}
      <div className="compass compass-right">
        <div className="compass-ring ring-one" />
        <div className="compass-ring ring-two" />
        <div className="compass-needle" />
        <span className="north">N</span>
        <span className="south">S</span>
        <span className="east">E</span>
        <span className="west">W</span>
      </div>

      {/* Greek temple */}
      <div className="temple">
        <div className="temple-roof" />
        <div className="temple-columns">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="temple-base" />
      </div>

      {/* Sailing ship */}
      <div className="ship">
        <div className="ship-sail sail-main" />
        <div className="ship-sail sail-small" />
        <div className="ship-mast" />
        <div className="ship-body" />
      </div>

      {/* Left parchment */}
      <aside className="parchment">
        <div className="parchment-top" />
        <h2>THE JOURNEY<br />BEGINS</h2>
        <div className="parchment-anchor">⚓</div>
        <div className="parchment-line" />
        <p>20 YEARS REMAIN.</p>
        <p>FOUR TRIALS<br />STAND AHEAD.</p>
        <div className="parchment-line" />
        <strong>FIND YOUR WAY<br />TO ITHACA.</strong>
        <div className="parchment-bottom" />
      </aside>

      {/* Header */}
      <header className="ithaca-header">
        <div className="brand">
          <span className="brand-symbol">✦</span>
          <div>
            <div className="brand-name">PROJECT ITHACA</div>
          </div>
        </div>

        <nav className="header-links">
          <button type="button" className="ghost-button small-btn" onClick={() => setRulesOpen(true)}>
            📜 RULES & SCORING
          </button>
          <Link to="/admin" className="ghost-button small-btn">
            📊 LEADERBOARD
          </Link>
          <Link to="/login" className="action-button small-btn">
            REGISTER / LOGIN
          </Link>
        </nav>
      </header>

      {/* Main hero */}
      <section className="ithaca-content">
        <p className="journey-label">A TECHNICAL ODYSSEY ACROSS THE UNKNOWN</p>

        <div className="gold-ornament">
          <span />
          <b>✦</b>
          <span />
        </div>

        <h1>ITHACA</h1>

        <div className="title-subtitle">THE TECH ODYSSEY</div>

        <div className="gold-ornament small">
          <span />
          <b>◆</b>
          <span />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link to="/login" className="journey-button">
            <span>✦</span>
            BEGIN JOURNEY
            <span>✦</span>
          </Link>
          <button type="button" className="secondary-button cinematic-button" onClick={() => setRulesOpen(true)}>
            <span>📜</span> View Rules & Lore
          </button>
        </div>

        {/* Journey information */}
        <div className="journey-card">
          <div className="journey-side">
            <span>⌛</span>
          </div>

          <div className="journey-info">
            <p>STARTING BANK</p>
            <strong>20.0</strong>
            <small>YEARS</small>
          </div>

          <div className="journey-divider" />

          <div className="journey-side">
            <span>⚓</span>
          </div>
        </div>
      </section>

      {/* Vignette */}
      <div className="vignette" />

      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </main>
  );
}

export default LandingPage;