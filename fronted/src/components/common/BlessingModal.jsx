import React, { useState } from 'react';

export default function BlessingModal({ isOpen, onClose, onConfirm, hasActiveSitOut }) {
  const [selectedChoice, setSelectedChoice] = useState(hasActiveSitOut ? 'BYPASS_SIT_OUT' : 'YEARS_DEDUCTION');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content cinematic-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-symbol">✨</span>
          <h3 className="modal-title">Wield The Blessing</h3>
        </div>
        <p className="modal-subtitle">
          The gods grant Odysseus divine favor. Choose how to bestow this power upon your voyage:
        </p>

        <div className="blessing-options">
          <label className={`blessing-card ${selectedChoice === 'YEARS_DEDUCTION' ? 'active' : ''}`}>
            <input
              type="radio"
              name="blessing_choice"
              value="YEARS_DEDUCTION"
              checked={selectedChoice === 'YEARS_DEDUCTION'}
              onChange={() => setSelectedChoice('YEARS_DEDUCTION')}
            />
            <div className="blessing-info">
              <h4>⏳ Accelerate the Journey</h4>
              <p>Deduct <strong>−3.0 Years</strong> immediately from your remaining voyage time.</p>
            </div>
          </label>

          <label className={`blessing-card ${selectedChoice === 'BYPASS_SIT_OUT' ? 'active' : ''}`}>
            <input
              type="radio"
              name="blessing_choice"
              value="BYPASS_SIT_OUT"
              checked={selectedChoice === 'BYPASS_SIT_OUT'}
              onChange={() => setSelectedChoice('BYPASS_SIT_OUT')}
            />
            <div className="blessing-info">
              <h4>🛡️ Break Circe's Spell</h4>
              <p>Bypass the Witch's Sit-Out curse immediately so your benched crewmate can rejoin now.</p>
            </div>
          </label>
        </div>

        <div className="modal-footer">
          <button className="ghost-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="action-button cinematic-button"
            onClick={() => {
              onConfirm(selectedChoice);
              onClose();
            }}
          >
            Invoke Divine Favor
          </button>
        </div>
      </div>
    </div>
  );
}
