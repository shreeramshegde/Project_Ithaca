import { useEffect, useMemo, useState } from 'react';
import { REWARD_LABELS } from '../data/islands.js';

function RewardPanel({ inventory, onUseHint, onUseReward, loading, activeMainQuestion, questions = [] }) {
  const [rewardType, setRewardType] = useState(inventory?.[0]?.reward_type || 'ATHENAS_SCROLL');
  const [selectedTargetId, setSelectedTargetId] = useState(activeMainQuestion?.id || '');

  const availableMainQuestions = useMemo(() => {
    return questions.filter(q => q.type === 'MAIN');
  }, [questions]);

  useEffect(() => {
    if (activeMainQuestion?.id) {
      setSelectedTargetId(activeMainQuestion.id);
    } else if (availableMainQuestions.length > 0 && !selectedTargetId) {
      setSelectedTargetId(availableMainQuestions[0].id);
    }
  }, [activeMainQuestion, availableMainQuestions, selectedTargetId]);

  const options = useMemo(() => {
    if (!inventory?.length) {
      return [];
    }

    return inventory.map((item) => ({
      value: item.reward_type,
      label: REWARD_LABELS[item.reward_type] || item.reward_type,
    }));
  }, [inventory]);

  useEffect(() => {
    if (options.length > 0 && !options.some((option) => option.value === rewardType)) {
      setRewardType(options[0]?.value);
    }
  }, [options, rewardType]);

  const needsTargetQuestion = rewardType === 'ATHENAS_SCROLL' || rewardType === 'CYCLOPS_EYE';

  const handleHintClick = () => {
    const targetId = activeMainQuestion?.id || selectedTargetId || availableMainQuestions[0]?.id;
    if (targetId) {
      onUseHint({ question_id: targetId });
    } else {
      onUseHint({});
    }
  };

  const handleRewardSubmit = (event) => {
    event.preventDefault();
    const payload = {
      reward_type: rewardType,
    };
    if (needsTargetQuestion) {
      const targetId = activeMainQuestion?.id || selectedTargetId || availableMainQuestions[0]?.id;
      if (targetId) {
        payload.target_question_id = targetId;
      }
    }
    onUseReward(payload);
  };

  return (
    <section className="surface-panel reward-panel cinematic-panel">
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ color: 'rgba(198,165,106,0.8)' }}>Hints and Artifacts</p>
        <h3 style={{ fontFamily: 'var(--display)' }}>Use Divine Favor</h3>
      </div>
      <div className="reward-actions cinematic-form">
        <button 
          type="button" 
          className="secondary-button cinematic-button" 
          onClick={handleHintClick} 
          disabled={loading || (!activeMainQuestion && availableMainQuestions.length === 0)}
        >
          {loading ? 'Requesting...' : `Use Standard Hint ${activeMainQuestion ? `(Q${activeMainQuestion.sequence_number || 1})` : ''}`}
        </button>
        
        <div style={{ margin: '20px 0', borderTop: '1px solid rgba(198,165,106,0.1)' }} />

        {options.length === 0 ? (
          <p style={{ color: 'var(--cloud)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No divine artifacts currently in your inventory. Complete pre-round trials to earn artifacts.
          </p>
        ) : (
          <form className="reward-form" onSubmit={handleRewardSubmit}>
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

            {needsTargetQuestion && (
              <div className="field">
                <label htmlFor="reward-target-question">Target Question</label>
                <select
                  id="reward-target-question"
                  className="cinematic-input"
                  value={selectedTargetId}
                  onChange={(event) => setSelectedTargetId(event.target.value)}
                >
                  {availableMainQuestions.map((q, idx) => (
                    <option key={q.id} value={q.id}>
                      Question {q.sequence_number || idx + 1} {q.progress_status === 'CORRECT' ? '(Completed)' : q.progress_status === 'INCORRECT' ? '(Attempted)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button className="action-button cinematic-button" type="submit" disabled={loading}>
              Unleash Artifact
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default RewardPanel;
