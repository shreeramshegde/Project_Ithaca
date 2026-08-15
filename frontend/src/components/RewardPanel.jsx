import { useEffect, useMemo, useState } from 'react';
import { REWARD_LABELS } from '../data/islands.js';

function RewardPanel({ inventory, hintsLeft, activeQuestionId, activeQuestion, disabled, onUseHint, onUseReward, loading }) {
  const [rewardType, setRewardType] = useState(inventory?.[0]?.reward_type || 'ATHENAS_SCROLL');
  const [showHintModal, setShowHintModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const options = useMemo(() => {
    if (!inventory?.length) {
      return Object.entries(REWARD_LABELS).map(([value, label]) => ({ value, label }));
    }

    return inventory.map((item) => ({
      value: item.reward_type,
      label: REWARD_LABELS[item.reward_type] || item.reward_type,
    }));
  }, [inventory]);

  useEffect(() => {
    if (!options.some((option) => option.value === rewardType)) {
      setRewardType(options[0]?.value || 'ATHENAS_SCROLL');
    }
  }, [options, rewardType]);

  const selectedRewardLabel = options.find(opt => opt.value === rewardType)?.label;
  const isCyclopsEyeInvalid = rewardType === 'CYCLOPS_EYE' && activeQuestion?.format !== 'MCQ';
  const unleashDisabled = disabled || loading || isCyclopsEyeInvalid;

  return (
    <section className="surface-panel reward-panel cinematic-panel">
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Hints and Artifacts</p>
        <h3 style={{ fontFamily: 'var(--display)' }}>Use Divine Favor</h3>
      </div>
      <div className="reward-actions cinematic-form">
        {showHintModal ? (
          <div style={{ padding: '15px', background: 'rgba(220, 53, 69, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
            <p style={{ color: 'var(--cloud-white)', marginBottom: '10px' }}>Are you sure? You only have {hintsLeft ?? 0} hints left!</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="button" className="action-button cinematic-button" onClick={() => { setShowHintModal(false); onUseHint(); }} disabled={loading}>Confirm</button>
              <button type="button" className="secondary-button cinematic-button" onClick={() => setShowHintModal(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button type="button" className="secondary-button cinematic-button" onClick={() => setShowHintModal(true)} disabled={disabled || loading || hintsLeft === 0}>
            {loading ? 'Requesting...' : (disabled ? 'Unavailable' : 'Use Standard Hint')}
          </button>
        )}
        
        <div style={{ margin: '20px 0', borderTop: '1px solid rgba(198,165,106,0.1)' }} />

        {showRewardModal ? (
          <div style={{ padding: '15px', background: 'rgba(198, 165, 106, 0.1)', border: '1px solid var(--gold)', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
            <p style={{ color: 'var(--cloud-white)', marginBottom: '10px' }}>Are you sure you want to unleash {selectedRewardLabel} on this challenge?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="button" className="action-button cinematic-button" onClick={() => { 
                setShowRewardModal(false); 
                onUseReward({ reward_type: rewardType, target_question_id: activeQuestionId || undefined }); 
              }} disabled={loading}>Unleash</button>
              <button type="button" className="secondary-button cinematic-button" onClick={() => setShowRewardModal(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <form
            className="reward-form"
            onSubmit={(event) => {
              event.preventDefault();
              setShowRewardModal(true);
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
            <button className="action-button cinematic-button" type="submit" disabled={unleashDisabled}>
              {disabled ? 'Unavailable' : (isCyclopsEyeInvalid ? 'MCQ Only' : 'Unleash Artifact')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default RewardPanel;
