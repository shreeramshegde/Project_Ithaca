import React, { useState } from 'react';

export default function SitOutModal({ isOpen, onClose, onConfirmMember }) {
  const [crewMember, setCrewMember] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content cinematic-panel witch-modal-border" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-symbol" style={{ color: '#e05a47' }}>🧙‍♀️</span>
          <h3 className="modal-title" style={{ color: '#e05a47' }}>The Witch's Curse Strikes!</h3>
        </div>
        <div className="modal-body">
          <p className="modal-warning-text">
            Circe has transformed a member of your crew! According to the event rules:
          </p>
          <div className="curse-instructions">
            <ul>
              <li><strong>One team member must physically sit out</strong> for the <em>immediately following question only</em>.</li>
              <li>The benched member cannot touch the keyboard or discuss the next puzzle.</li>
              <li>After the next question is attempted, the crewmate returns to human form and rejoins the team!</li>
              <li><em>(Or use <strong>The Blessing</strong> if available in your inventory to bypass this penalty!)</em></li>
            </ul>
          </div>
          <div className="field" style={{ marginTop: '1.25rem' }}>
            <label htmlFor="member-name">Name of Benched Crewmate (for Volunteer Log):</label>
            <input
              id="member-name"
              className="cinematic-input"
              value={crewMember}
              onChange={(e) => setCrewMember(e.target.value)}
              placeholder="e.g. Alex"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="action-button cinematic-button"
            style={{ backgroundColor: '#8c2a2a', borderColor: '#e05a47', width: '100%' }}
            onClick={() => {
              onConfirmMember(crewMember || 'Crewmate');
              onClose();
            }}
          >
            Accept the Sorceress's Curse
          </button>
        </div>
      </div>
    </div>
  );
}
