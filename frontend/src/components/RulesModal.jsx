import React, { useState, useEffect } from 'react';
import '../island-ui.css';

function RulesModal({ islandSlug, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 400);
  };

  const getRulesContent = () => {
    if (islandSlug === 'lotus') {
      return (
        <>
          <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 8px 0', fontSize: '1.25rem', textAlign: 'center' }}>
            🌺 Island 1: The Lotus Eaters
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#5a3818', textAlign: 'center', margin: '0 0 12px 0' }}>
            "A deceptive shoreline where choices feel easy, but wrong paths spawn endless extra trials."
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.92rem' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Progression Type:</strong> <strong>Non-Sequential (Free Choice)</strong>. You may select and attempt the 4 Base Trials in any order.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Total Questions:</strong> <strong>1 Pre-Round Ritual + 4 Base Trials + up to 10 Penalty Inscriptions</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Scoring & Consequences:</strong>
              <div style={{ paddingLeft: '10px', marginTop: '4px' }}>
                • <strong>Correct Answer:</strong> <strong>-0.25 years</strong> deducted from voyage.<br/>
                • <strong>Incorrect Answer:</strong> <strong>+1.0 year</strong> penalty added to voyage <strong>AND 1 extra Penalty Inscription spawns</strong> on your map!
              </div>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Pre-Round Artifact (Athena's Scroll):</strong> Solve the Memory Stone Stack LIFO ritual to earn the scroll. Invoking it grants an Oracle hint <strong>without consuming your standard hints</strong>.
            </li>
            <li>
              <strong>Clearance Condition:</strong> You cannot sail to Island 2 until all 4 Base Trials <strong>and all spawned Penalty Inscriptions</strong> are cleared.
            </li>
          </ul>
        </>
      );
    }

    if (islandSlug === 'cyclops') {
      return (
        <>
          <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 8px 0', fontSize: '1.25rem', textAlign: 'center' }}>
            👁️ Island 2: Polyphemus' Cave
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#5a3818', textAlign: 'center', margin: '0 0 12px 0' }}>
            "Torchlit caverns where brute force fails and mathematical logic prevails."
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.92rem' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Progression Type:</strong> <strong>Strictly Sequential</strong>. You must solve each step to unlock the next cave passage.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Total Questions:</strong> <strong>1 Pre-Round Ritual + 3 Sequential Main Trials</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Scoring & Consequences:</strong>
              <div style={{ paddingLeft: '10px', marginTop: '4px' }}>
                • <strong>Correct Answer:</strong> <strong>-0.5 years</strong> deducted from voyage.<br/>
                • <strong>Incorrect Answer:</strong> <strong>+0.75 years</strong> added to voyage (or <strong>+0.375 years</strong> if Cyclops' Eye is active).
              </div>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Pre-Round Artifact (Cyclops' Eye):</strong> Passively cuts wrong-answer penalties in half (<strong>+0.75y → +0.375y</strong>) across all Island 2 questions once earned.
            </li>
            <li>
              <strong>Clearance Condition:</strong> Complete all 3 sequential steps (Ritual Code, Echoing XOR, and Sheep Logic) to escape the cave.
            </li>
          </ul>
        </>
      );
    }

    if (islandSlug === 'sirens') {
      return (
        <>
          <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 8px 0', fontSize: '1.25rem', textAlign: 'center' }}>
            🌊 Island 3: Sirens' Strait
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#5a3818', textAlign: 'center', margin: '0 0 12px 0' }}>
            "Enchanting voices across dark water where mathematical precision cuts through illusion."
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.92rem' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Progression Type:</strong> <strong>Strictly Sequential</strong>. Decode each song in order to steer through the shoals.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Total Questions:</strong> <strong>1 Pre-Round Ritual + 6 Harmonic Trials</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Scoring & Consequences:</strong>
              <div style={{ paddingLeft: '10px', marginTop: '4px' }}>
                • <strong>Correct Answer:</strong> <strong>-0.75 years</strong> deducted from voyage.<br/>
                • <strong>Incorrect Answer:</strong> <strong>+0.5 years</strong> added to voyage.<br/>
                • <strong>Hidden Trap Penalty:</strong> Beware traps on the pre-round that add +1.0 extra year.
              </div>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Pre-Round Artifact (Hermes' Sandals):</strong> Instantly deducts <strong>-1.0 year</strong> from your voyage when invoked.
            </li>
            <li>
              <strong>Clearance Condition:</strong> Complete all 6 sequential trials (Voltage, Deque, Beats, Series, Geometry, Honeycomb) to clear the strait.
            </li>
          </ul>
        </>
      );
    }

    if (islandSlug === 'witch' || islandSlug === 'scylla') {
      return (
        <>
          <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 8px 0', fontSize: '1.25rem', textAlign: 'center' }}>
            ⚡ Island 4: The Scylla Island
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#5a3818', textAlign: 'center', margin: '0 0 12px 0' }}>
            "Crashing reefs, six-headed terrors, and Circe's archives before Ithaca is reached."
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.92rem' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Progression Type:</strong> <strong>Sequential Stages + Transmutation Interlude</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Total Questions:</strong> <strong>1 Pre-Round Grid + 2 Interactive Stages + 6x6 Runic Sudoku</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Scoring & Consequences:</strong>
              <div style={{ paddingLeft: '10px', marginTop: '4px' }}>
                • <strong>Correct Answer:</strong> <strong>-1.0 year</strong> deducted from voyage.<br/>
                • <strong>Incorrect Answer:</strong> <strong>+0.25 years</strong> added to voyage + <strong>Scylla Ambush</strong> (team must solve Sudoku to escape).
              </div>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Pre-Round Artifact (The Blessing):</strong> Solve the 10×10 Labyrinth to gain divine favor that deducts <strong>-1.5 years</strong> from your journey.
            </li>
            <li>
              <strong>Clearance Condition:</strong> Solve Stage 1 (Decision Tree) → Solve 6x6 Runic Sudoku Ward → Solve Stage 2 (Terminal Archives) to reach Ithaca!
            </li>
          </ul>
        </>
      );
    }

    return (
      <>
        <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 10px 0', fontSize: '1.25rem', textAlign: 'center' }}>
          The Odyssey of Project Ithaca
        </h4>
        <ul style={{ paddingLeft: '22px', margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>Every team begins the journey with <strong>10.0 Voyage Years</strong>.</li>
          <li style={{ marginBottom: '10px' }}>Solve non-MCQ algorithmic challenges to reduce remaining years.</li>
          <li>Reach Ithaca with the lowest remaining years to conquer the leaderboard!</li>
        </ul>
      </>
    );
  };

  return (
    <div className={`parchment-rules-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className={`parchment-rules-wrapper ${isOpen ? 'unrolled' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Left Wooden Scroll Roller Rod */}
        <div className="scroll-rod rod-left">
          <div className="rod-finial top" />
          <div className="rod-shaft" />
          <div className="rod-finial bottom" />
        </div>

        {/* Unrolling Parchment Body */}
        <div className="parchment-paper">
          <div className="parchment-crease top" />
          
          <div className="parchment-content-inner">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.8rem' }}>📜</span>
              <h3 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                Sacred Laws of the Island
              </h3>
            </div>

            <div style={{ height: '2px', width: '80%', margin: '12px auto 16px auto', background: 'linear-gradient(90deg, transparent, #8c6d3b, transparent)' }} />

            <div style={{ color: '#2b180a', lineHeight: '1.6', textAlign: 'left', margin: '14px 0', fontSize: '1rem', fontFamily: 'var(--display)' }}>
              {getRulesContent()}
            </div>

            <button 
              type="button"
              onClick={handleClose}
              className="parchment-seal-btn"
              style={{ width: '100%', marginTop: '16px' }}
            >
              Acknowledge & Begin Voyage
            </button>
          </div>

          <div className="parchment-crease bottom" />
        </div>

        {/* Right Wooden Scroll Roller Rod */}
        <div className="scroll-rod rod-right">
          <div className="rod-finial top" />
          <div className="rod-shaft" />
          <div className="rod-finial bottom" />
        </div>
      </div>

      <style>{`
        .parchment-rules-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(3, 8, 16, 0.88);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2500;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          padding: 20px;
        }
        .parchment-rules-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .parchment-rules-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
          max-width: 580px;
          width: 95%;
          filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95));
          transform: scale(0.92);
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .parchment-rules-wrapper.unrolled {
          transform: scale(1);
        }

        .parchment-rules-wrapper .parchment-paper {
          flex: 1;
          position: relative;
          background: 
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.12) 100%),
            linear-gradient(180deg, #dfc698 0%, #f4e4be 15%, #ebd7ab 50%, #edd8ad 85%, #cfb380 100%);
          border-top: 2px solid #a6844b;
          border-bottom: 2px solid #8c6d3b;
          margin: 6px -4px;
          overflow-y: auto;
          max-height: 85vh;
          max-width: 0;
          opacity: 0;
          transition: max-width 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
          box-shadow: inset 0 0 40px rgba(115, 75, 28, 0.45), inset 0 2px 10px rgba(0,0,0,0.25);
        }
        .parchment-rules-wrapper.unrolled .parchment-paper {
          max-width: 620px;
          opacity: 1;
        }

        .parchment-rules-wrapper strong {
          color: #592e10;
        }
      `}</style>
    </div>
  );
}

export default RulesModal;
