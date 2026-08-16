import React from 'react';

export default function HintModal({ hint, onClose }) {
  if (!hint) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content cinematic-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-symbol">🏛️</span>
          <h3 className="modal-title">Wisdom of Athena</h3>
        </div>
        <div className="modal-body">
          <p className="hint-quote">"{hint}"</p>
        </div>
        <div className="modal-footer">
          <button className="action-button cinematic-button" onClick={onClose}>
            Heed the Guidance
          </button>
        </div>
      </div>
    </div>
  );
}
