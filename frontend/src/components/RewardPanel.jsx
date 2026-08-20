import { useEffect, useMemo, useState } from 'react';
import { REWARD_LABELS } from '../data/islands.js';

const ARTIFACT_INFO = {
  ATHENAS_SCROLL: {
    icon: '📜',
    title: "Athena's Scroll",
    description: 'Bestows divine strategic wisdom upon your chosen trial.',
    targetRequired: true,
  },
  CYCLOPS_EYE: {
    icon: '👁',
    title: "Cyclops' Eye",
    description: 'Pierces through illusions to eliminate one wrong path on a multiple-choice trial.',
    targetRequired: true,
  },
  HERMES_SANDALS: {
    icon: '🪽',
    title: "Hermes' Sandals",
    description: 'Fleet-footed talismans that bypass Sirens delays, deducting 2 years from your voyage.',
    targetRequired: false,
  },
  THE_BLESSING: {
    icon: '✨',
    title: 'The Blessing of Troy',
    description: 'Divine grace that shields your crew from Circe and deducts 3 years.',
    targetRequired: false,
  },
};

function RewardPanel({ inventory = [], onUseHint, onUseReward, loading, activeMainQuestion, questions = [] }) {
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

  const activeInventory = useMemo(() => {
    return inventory.filter(item => !item.is_used);
  }, [inventory]);

  const handleHintClick = () => {
    const targetId = activeMainQuestion?.id || selectedTargetId || availableMainQuestions[0]?.id;
    if (targetId) {
      onUseHint({ question_id: targetId });
    } else {
      onUseHint({});
    }
  };

  const handleInvokeArtifact = (rewardType) => {
    const info = ARTIFACT_INFO[rewardType];
    const payload = { reward_type: rewardType };

    if (info?.targetRequired) {
      const targetId = activeMainQuestion?.id || selectedTargetId || availableMainQuestions[0]?.id;
      if (targetId) {
        payload.target_question_id = targetId;
      }
    }
    onUseReward(payload);
  };

  return (
    <section className="console-card-cinematic" style={{ marginTop: '20px' }}>
      <div className="console-header-badge">
        <span className="console-kind-pill">Divine Reliquary & Auguries</span>
        <span className="trials-stats-badge">
          {activeInventory.length} Artifact{activeInventory.length !== 1 ? 's' : ''} Ready
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
        {/* ORACLE HINT CARD (Only available once Pre-Round is conquered) */}
        {!activeMainQuestion ? (
          <div style={{
            background: 'rgba(10, 25, 45, 0.4)',
            border: '1px dashed rgba(198, 165, 106, 0.25)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.8rem', opacity: 0.5 }}>🔒</span>
            <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: 0, fontSize: '1rem' }}>
              Oracle's Clue Sealed
            </h4>
            <p style={{ color: 'rgba(231, 229, 221, 0.6)', fontSize: '0.84rem', margin: 0 }}>
              Hints cannot be used during the Oracle's Pre-Round Ritual. Complete the ritual to unlock clues for main island trials.
            </p>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(145deg, rgba(10, 25, 45, 0.85) 0%, rgba(5, 15, 26, 0.95) 100%)',
            border: '1.5px solid rgba(198, 165, 106, 0.35)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.6rem' }}>🔮</span>
                <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: 0, fontSize: '1.1rem' }}>
                  Seek Oracle's Hint
                </h4>
              </div>
              <p style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.88rem', lineHeight: '1.45', margin: 0 }}>
                Consult Athena and the fates for an illuminating clue on your active trial (Trial {activeMainQuestion.sequence_number || 1}).
              </p>
            </div>

            <button 
              type="button" 
              className="spoken-submit-btn"
              onClick={handleHintClick} 
              disabled={loading}
              style={{ padding: '10px', fontSize: '0.9rem' }}
            >
              {loading ? 'Consulting...' : `Invoke Oracle Clue (Trial ${activeMainQuestion.sequence_number || 1})`}
            </button>
          </div>
        )}

        {/* ACTIVE ARTIFACTS OR EMPTY STATE */}
        {activeInventory.length === 0 ? (
          <div style={{
            background: 'rgba(5, 11, 20, 0.5)',
            border: '1px dashed rgba(198, 165, 106, 0.25)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2rem', opacity: 0.4, marginBottom: '8px' }}>🏺</span>
            <p style={{ color: 'rgba(231, 229, 221, 0.6)', fontSize: '0.9rem', margin: 0 }}>
              The sacred reliquary is empty. Conquer the Pre-Round Rituals on each island to earn mythical divine artifacts.
            </p>
          </div>
        ) : (
          <div className="artifacts-grid" style={{ gridTemplateColumns: '1fr', margin: 0 }}>
            {activeInventory.map((item) => {
              const info = ARTIFACT_INFO[item.reward_type] || {
                icon: '⚡',
                title: REWARD_LABELS[item.reward_type] || item.reward_type,
                description: 'Divine mythical artifact.',
                targetRequired: false,
              };

              return (
                <div key={item.id} className="artifact-card-item">
                  <div className="artifact-card-header">
                    <span className="artifact-icon">{info.icon}</span>
                    <div>
                      <h5 className="artifact-name">{info.title}</h5>
                      <span style={{ color: 'rgba(231, 229, 221, 0.7)', fontSize: '0.8rem' }}>
                        {info.description}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    className="artifact-invoke-btn"
                    onClick={() => handleInvokeArtifact(item.reward_type)}
                    disabled={loading}
                  >
                    {loading ? 'Channeling...' : `⚡ Invoke ${info.title}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default RewardPanel;
