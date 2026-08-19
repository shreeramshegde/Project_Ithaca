import React, { useState, useEffect } from 'react';
import '../island-ui.css';

function RulesModal({ islandSlug, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getRulesContent = () => {
    if (islandSlug === 'lotus') {
      return (
        <>
          <h3>Island 1: The Lotus Eaters</h3>
          <ul>
            <li>You must answer the <strong>4 Base Questions</strong> in any order by selecting them on the map.</li>
            <li>If you answer incorrectly, you will receive a time penalty and must try again.</li>
            <li>For every wrong answer, a <strong>Penalty Question</strong> will spawn on the map.</li>
            <li>You cannot sail to the next island until all Base Questions <strong>and</strong> all spawned Penalty Questions are correctly answered.</li>
          </ul>
        </>
      );
    }
    
    return (
      <>
        <h3>The Journey Continues</h3>
        <ul>
          <li>Questions must be answered in strict sequential order.</li>
          <li>Failing a question applies a time penalty, but no penalty questions will spawn.</li>
        </ul>
      </>
    );
  };

  return (
    <div className={`rules-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`rules-modal-content ${isOpen ? 'open' : ''}`}>
        <h2 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', borderBottom: '1px solid rgba(198, 165, 106, 0.3)', paddingBottom: '10px' }}>
          Island Rules
        </h2>
        
        <div className="rules-body" style={{ color: 'var(--cloud-white)', lineHeight: '1.6', textAlign: 'left', margin: '20px 0' }}>
          {getRulesContent()}
        </div>

        <button 
          onClick={handleClose}
          className="ghost-button cinematic-button"
          style={{ width: '100%', marginTop: '15px' }}
        >
          Acknowledge & Begin
        </button>
      </div>

      <style>{`
        .rules-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(7, 21, 38, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .rules-modal-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
        .rules-modal-content {
          background: rgba(7, 21, 38, 0.95);
          border: 1px solid rgba(198, 165, 106, 0.4);
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(198, 165, 106, 0.1);
          transform: translateY(20px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .rules-modal-content.open {
          transform: translateY(0) scale(1);
        }
        .rules-body ul {
          padding-left: 20px;
        }
        .rules-body li {
          margin-bottom: 12px;
        }
        .rules-body strong {
          color: var(--gold);
        }
      `}</style>
    </div>
  );
}

export default RulesModal;
