import React, { useEffect, useState } from 'react';

function FeedbackBanner({ result, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (result) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [result]);

  if (!result && !isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 400);
  };

  const isSuccess = result?.kind === 'success';
  const isError = result?.kind === 'error';
  const isHint = result?.title?.toLowerCase().includes('hint') || result?.title?.toLowerCase().includes('scroll') || result?.title?.toLowerCase().includes('oracle');

  const icon = isSuccess ? '📜 ✓' : isError ? '📜 ✕' : '📜 ✦';
  const themeClass = isSuccess ? 'parchment-success' : isError ? 'parchment-error' : 'parchment-gold';

  return (
    <div className={`parchment-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className={`parchment-wrapper ${isOpen ? 'unrolled' : ''} ${themeClass}`} onClick={(e) => e.stopPropagation()}>
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
            <div className="parchment-header-seal">
              <span className="seal-glyph">{icon}</span>
              <h3 className="parchment-title">
                {result?.title || 'Divine Revelation'}
              </h3>
            </div>

            <div className="parchment-divider" />

            <p className="parchment-text">
              {result?.message}
            </p>

            <button 
              type="button"
              className="parchment-seal-btn" 
              onClick={handleClose}
            >
              Seal Parchment & Continue
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
        .parchment-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(3, 8, 16, 0.88);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 3000;
          opacity: 0;
          transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          padding: 20px;
        }
        .parchment-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* The Scroll Structure */
        .parchment-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
          max-width: 620px;
          width: 95%;
          filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95));
          transform: scale(0.92);
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .parchment-wrapper.unrolled {
          transform: scale(1);
        }

        /* Roller Rods (Left & Right Handles) */
        .scroll-rod {
          position: relative;
          width: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          z-index: 5;
        }
        .rod-shaft {
          flex: 1;
          width: 16px;
          background: linear-gradient(90deg, #3d2314 0%, #784826 35%, #9c6339 60%, #4a2a16 100%);
          border-radius: 4px;
          box-shadow: inset 0 0 4px rgba(0,0,0,0.8), 2px 0 8px rgba(0,0,0,0.6);
        }
        .rod-finial {
          width: 22px;
          height: 18px;
          background: radial-gradient(circle at 35% 35%, #e6c587 0%, #b8860b 60%, #5c4308 100%);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.6);
        }
        .rod-finial.top { margin-bottom: -4px; }
        .rod-finial.bottom { margin-top: -4px; }

        /* Parchment Paper Unrolling Animation */
        .parchment-paper {
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
        .parchment-wrapper.unrolled .parchment-paper {
          max-width: 600px;
          opacity: 1;
        }

        /* Aged Creases on Edges */
        .parchment-crease {
          position: absolute;
          left: 0; right: 0;
          height: 8px;
          pointer-events: none;
          z-index: 2;
        }
        .parchment-crease.top {
          top: 0;
          background: linear-gradient(180deg, rgba(82, 53, 19, 0.4) 0%, transparent 100%);
        }
        .parchment-crease.bottom {
          bottom: 0;
          background: linear-gradient(0deg, rgba(82, 53, 19, 0.4) 0%, transparent 100%);
        }

        /* Text & Content inside the Scroll */
        .parchment-content-inner {
          padding: 32px 36px;
          min-width: 320px;
          text-align: center;
          color: #2b180a;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
          animation: parchmentFadeIn 0.6s ease forwards;
        }

        @keyframes parchmentFadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          50% { opacity: 0; }
          100% { opacity: 1; transform: translateY(0); }
        }

        .parchment-header-seal {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .seal-glyph {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .parchment-title {
          font-family: var(--display);
          font-size: 1.45rem;
          letter-spacing: 0.04em;
          margin: 0;
          font-weight: bold;
          color: #3b1e08;
        }

        .parchment-divider {
          height: 2px;
          width: 80%;
          margin: 14px auto 18px auto;
          background: linear-gradient(90deg, transparent 0%, #8c6d3b 50%, transparent 100%);
          opacity: 0.65;
        }

        .parchment-text {
          font-family: var(--display);
          font-size: 1.12rem;
          line-height: 1.65;
          margin: 0 0 24px 0;
          color: #1f1105;
          font-style: normal;
          white-space: pre-wrap;
          font-weight: 500;
        }

        /* Mythic Wax Seal Action Button */
        .parchment-seal-btn {
          font-family: var(--display);
          background: linear-gradient(180deg, #4a2411 0%, #2e1407 100%);
          color: #f7edd7;
          border: 1.5px solid #a6844b;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 0.98rem;
          font-weight: bold;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255,255,255,0.25);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .parchment-seal-btn:hover {
          background: linear-gradient(180deg, #613017 0%, #3d1b0a 100%);
          border-color: #d4af37;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), inset 0 1px 4px rgba(255,255,255,0.4);
        }
        .parchment-seal-btn:active {
          transform: translateY(1px);
        }

        /* State Variations */
        .parchment-success .seal-glyph { color: #2d5a1e; }
        .parchment-error .seal-glyph { color: #782216; }
        .parchment-gold .seal-glyph { color: #805b10; }

        @media (max-width: 480px) {
          .parchment-content-inner {
            padding: 24px 18px;
            min-width: 240px;
          }
          .parchment-title {
            font-size: 1.25rem;
          }
          .parchment-text {
            font-size: 0.98rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FeedbackBanner;
