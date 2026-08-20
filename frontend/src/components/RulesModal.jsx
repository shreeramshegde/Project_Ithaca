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
          <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 10px 0', fontSize: '1.25rem', textAlign: 'center' }}>
            Island 1: The Lotus Eaters
          </h4>
          <ul style={{ paddingLeft: '22px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>You must answer the <strong>4 Base Questions</strong> in any order by selecting them on the map.</li>
            <li style={{ marginBottom: '10px' }}>If you answer incorrectly, you will receive a time penalty and must try again.</li>
            <li style={{ marginBottom: '10px' }}>For every wrong answer, an extra <strong>Penalty Inscription</strong> will spawn on the map.</li>
            <li>You cannot sail to the next island until all Base Questions <strong>and</strong> all spawned Penalty Inscriptions are correctly solved.</li>
          </ul>
        </>
      );
    }
    
    return (
      <>
        <h4 style={{ fontFamily: 'var(--display)', color: '#3b1e08', margin: '0 0 10px 0', fontSize: '1.25rem', textAlign: 'center' }}>
          The Odyssey Continues
        </h4>
        <ul style={{ paddingLeft: '22px', margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>Questions on this island must be conquered in <strong>strict sequential order</strong>.</li>
          <li style={{ marginBottom: '10px' }}>Failing a trial applies an immediate time penalty to your voyage.</li>
          <li>Solve each stage to unlock the path forward and navigate closer to Ithaca.</li>
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
          overflow: hidden;
          max-width: 0;
          opacity: 0;
          transition: max-width 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
          box-shadow: inset 0 0 40px rgba(115, 75, 28, 0.45), inset 0 2px 10px rgba(0,0,0,0.25);
        }
        .parchment-rules-wrapper.unrolled .parchment-paper {
          max-width: 560px;
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
