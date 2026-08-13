import { useMemo, useState } from 'react';
import { REWARD_LABELS } from '../data/islands.js';

function RewardPanel({ inventory, onUseHint, onUseReward, loading }) {
  const [rewardType, setRewardType] = useState(inventory?.[0]?.reward_type || 'ATHENAS_SCROLL');
  const [targetQuestionId, setTargetQuestionId] = useState('');

  const options = useMemo(() => {
    if (!inventory?.length) {
      return Object.entries(REWARD_LABELS).map(([value, label]) => ({ value, label }));
    }

    return inventory.map((item) => ({
      value: item.reward_type,
      label: REWARD_LABELS[item.reward_type] || item.reward_type,
    }));
  }, [inventory]);

  return (
    <section className="surface-panel reward-panel cinematic-panel">
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Hints and Artifacts</p>
        <h3 style={{ fontFamily: 'var(--display)' }}>Use Divine Favor</h3>
      </div>
      <div className="reward-actions cinematic-form">
        <button type="button" className="secondary-button cinematic-button" onClick={onUseHint} disabled={loading}>
          {loading ? 'Requesting...' : 'Use Standard Hint'}
        </button>
        
        <div style={{ margin: '20px 0', borderTop: '1px solid rgba(198,165,106,0.1)' }} />

        <form
          className="reward-form"
          onSubmit={(event) => {
            event.preventDefault();
            onUseReward({
              reward_type: rewardType,
              target_question_id: targetQuestionId || undefined,
            });
          }}
        >
          <div className="field">
            <label htmlFor="reward-type">Artifact to use</label>
            <select 
              id="reward-type" 
              className="cinematic-input"
              value={rewardType} 
              onChange={(event) => setRewardType(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="reward-question-id">Target Resonance (UUID)</label>
            <input
              id="reward-question-id"
              className="cinematic-input"
              value={targetQuestionId}
              onChange={(event) => setTargetQuestionId(event.target.value)}
              placeholder="Required for targeted rewards"
            />
          </div>
          <button className="action-button cinematic-button" type="submit" disabled={loading}>
            Unleash Artifact
          </button>
        </form>
      </div>
    </section>
  );
}

export default RewardPanel;
