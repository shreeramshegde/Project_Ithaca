import React, { useState } from 'react';
import { REWARD_LABELS, REWARD_DESCRIPTIONS } from '../data/islands.js';
import BlessingModal from './common/BlessingModal.jsx';

function RewardPanel({ inventory = [], onUseHint, onUseReward, loading, hintsLeft = 3, extraHints = 0, currentIslandSlug, activeQuestionId, hasActiveSitOut }) {
  const [blessingOpen, setBlessingOpen] = useState(false);

  const activeRewards = inventory.filter((item) => !item.is_used);

  const handleRewardClick = (item) => {
    if (item.reward_type === 'THE_BLESSING') {
      setBlessingOpen(true);
    } else if (item.reward_type === 'CYCLOPS_EYE') {
      onUseReward({
        reward_type: 'CYCLOPS_EYE',
        target_question_id: activeQuestionId,
      });
    } else if (item.reward_type === 'ATHENAS_SCROLL') {
      // Automatically grants hint
      onUseHint();
    } else {
      onUseReward({
        reward_type: item.reward_type,
        target_question_id: activeQuestionId,
      });
    }
  };

  const handleBlessingConfirm = (choice) => {
    onUseReward({
      reward_type: 'THE_BLESSING',
      choice,
    });
  };

  return (
    <>
      <section className="surface-panel reward-panel cinematic-panel">
        <div className="panel-header-row">
          <div>
            <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Hold & Armory</p>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem' }}>Divine Favor & Hints</h3>
          </div>
          <div className="hint-pill-badge">
            <span>💡 {hintsLeft} Standard {extraHints > 0 && `+ ${extraHints} Athena`} Left</span>
          </div>
        </div>

        <div className="reward-action-grid">
          {/* Hint Action Button */}
          <div className="reward-card hint-card">
            <div className="reward-card-header">
              <span className="reward-icon">🏛️</span>
              <div>
                <h4>Ask Athena for a Hint</h4>
                <p>
                  {extraHints > 0
                    ? "Athena's Scroll is active! This hint will NOT consume a standard hint."
                    : `Consumes 1 of your 3 standard hints (${hintsLeft} remaining).`}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="secondary-button cinematic-button"
              onClick={onUseHint}
              disabled={loading || (hintsLeft <= 0 && extraHints <= 0)}
            >
              {loading ? 'Consulting the Gods...' : extraHints > 0 ? "Use Athena's Free Hint" : 'Use Standard Hint'}
            </button>
          </div>

          {/* Active Artifacts List */}
          <div className="reward-card artifacts-card">
            <h4>Acquired Artifacts</h4>
            {activeRewards.length === 0 ? (
              <p className="muted-copy" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                No active artifacts in inventory. Answer the Pre-Round GK questions on each island to earn them!
              </p>
            ) : (
              <div className="active-rewards-list">
                {activeRewards.map((item) => (
                  <div key={item.id} className="artifact-pill-card">
                    <div>
                      <strong>{REWARD_LABELS[item.reward_type] || item.reward_type}</strong>
                      <p className="artifact-desc">{REWARD_DESCRIPTIONS[item.reward_type]}</p>
                    </div>
                    <button
                      type="button"
                      className="action-button cinematic-button small-btn"
                      onClick={() => handleRewardClick(item)}
                      disabled={loading}
                    >
                      Activate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <BlessingModal
        isOpen={blessingOpen}
        onClose={() => setBlessingOpen(false)}
        onConfirm={handleBlessingConfirm}
        hasActiveSitOut={hasActiveSitOut}
      />
    </>
  );
}

export default RewardPanel;
