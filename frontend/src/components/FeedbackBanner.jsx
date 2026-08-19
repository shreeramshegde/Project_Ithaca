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
    }, 250);
  };

  const isSuccess = result?.kind === 'success';
  const isError = result?.kind === 'error';

  const icon = isSuccess ? '✓' : isError ? '⚠' : '✦';
  const color = isSuccess ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--gold)';

  return (
    <div className={`feedback-modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div 
        className={`feedback-modal-content ${isOpen ? 'open' : ''} ${result?.kind || 'info'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-icon" style={{ color, fontSize: '2.5rem', marginBottom: '10px' }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: 'var(--display)', color, margin: '0 0 10px 0', fontSize: '1.4rem' }}>
          {result?.title || 'Divine Revelation'}
        </h3>
        <p style={{ color: 'var(--cloud-white)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 20px 0', whiteSpace: 'pre-wrap' }}>
          {result?.message}
        </p>
        <button 
          className="ghost-button cinematic-button" 
          onClick={handleClose}
          style={{ width: '100%', borderColor: color, color: color }}
        >
          Acknowledge
        </button>
      </div>

      <style>{`
        .feedback-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(7, 21, 38, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .feedback-modal-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
        .feedback-modal-content {
          background: rgba(7, 21, 38, 0.98);
          border: 1px solid rgba(198, 165, 106, 0.4);
          border-radius: 12px;
          padding: 28px;
          max-width: 480px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          transform: translateY(20px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .feedback-modal-content.open {
          transform: translateY(0) scale(1);
        }
        .feedback-modal-content.success {
          border-color: rgba(137, 171, 118, 0.6);
          box-shadow: 0 0 30px rgba(137, 171, 118, 0.2);
        }
        .feedback-modal-content.error {
          border-color: rgba(188, 120, 101, 0.6);
          box-shadow: 0 0 30px rgba(188, 120, 101, 0.2);
        }
        .feedback-modal-content.info {
          border-color: rgba(198, 165, 106, 0.6);
          box-shadow: 0 0 30px rgba(198, 165, 106, 0.2);
        }
      `}</style>
    </div>
  );
}

export default FeedbackBanner;
