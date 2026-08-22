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
    description: "Pierces Polyphemus' gaze to halve the penalty burden on this island (-0.375 years).",
    targetRequired: false,
  },
  HERMES_SANDALS: {
    icon: '🪽',
    title: "Hermes' Sandals",
    description: 'Fleet-footed talismans that bypass Sirens delays, deducting 1.0 year from your voyage.',
    targetRequired: false,
  },
  THE_BLESSING: {
    icon: '✨',
    title: 'The Blessing of Troy',
    description: 'Divine grace that shields your crew from Circe and deducts 1.5 years.',
    targetRequired: false,
  },
};

const REWARD_ISLAND_MAP = {
  ATHENAS_SCROLL: 1,
  CYCLOPS_EYE: 2,
  HERMES_SANDALS: 3,
  THE_BLESSING: 4,
};

function RewardPanel({ inventory = [], onUseHint, onUseReward, loading, activeMainQuestion, questions = [], currentIslandId = 1 }) {
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

  // Only show rewards that are NOT used AND belong strictly to the current island
  const activeInventory = useMemo(() => {
    return inventory.filter(item => !item.is_used && REWARD_ISLAND_MAP[item.reward_type] === currentIslandId);
  }, [inventory, currentIslandId]);

  const handleHintClick = () => {
    const targetId = activeMainQuestion?.id || selectedTargetId || availableMainQuestions[0]?.id;
    if (targetId) {
      onUseHint({ question_id: targetId });
    } else {
      onUseHint({});
    }
  };

  const [confirmArtifact, setConfirmArtifact] = useState(null);

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
    setConfirmArtifact(null);
  };

  return (
    <section className="console-card-cinematic" style={{ marginTop: '20px' }}>
      <div className="console-header-badge">
        <span className="console-kind-pill">Divine Reliquary & Auguries</span>
        <span className="trials-stats-badge">
          {activeInventory.length} Artifact{activeInventory.length !== 1 ? 's' : ''} Ready
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px', marginTop: '16px' }}>
        {/* ORACLE HINT CARD (Only available once Pre-Round is conquered) */}
        {!activeMainQuestion ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(8, 20, 36, 0.6) 0%, rgba(4, 12, 22, 0.75) 100%)',
            border: '1.5px dashed rgba(198, 165, 106, 0.3)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '10px',
            minHeight: '180px'
          }}>
            <span style={{ fontSize: '2rem', opacity: 0.45 }}>🔒</span>
            <div>
              <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: '0 0 6px 0', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                Oracle's Clue Sealed
              </h4>
              <p style={{ color: 'rgba(231, 229, 221, 0.65)', fontSize: '0.85rem', margin: 0, lineHeight: '1.45' }}>
                Hints are locked during the Pre-Round Ritual. Complete the ritual to unlock auguries for main island trials.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(198, 165, 106, 0.12) 0%, rgba(7, 21, 38, 0.95) 100%)',
            border: '1.5px solid var(--gold)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(198, 165, 106, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '90px',
              height: '90px',
              background: 'radial-gradient(circle, rgba(198, 165, 106, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 8px rgba(198, 165, 106, 0.6))' }}>🔮</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: 0, fontSize: '1.15rem', letterSpacing: '0.04em' }}>
                    Seek Oracle's Hint
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(231, 229, 221, 0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Athena's Divine Augury
                  </span>
                </div>
              </div>
              <p style={{ color: 'rgba(231, 229, 221, 0.85)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                Consult Athena and the fates for an illuminating clue on your active trial (Stage {activeMainQuestion.sequence_number || 1}).
              </p>
            </div>

            <button 
              type="button" 
              className="spoken-submit-btn"
              onClick={handleHintClick} 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 18px',
                fontSize: '0.92rem',
                margin: 0,
                background: 'linear-gradient(180deg, rgba(198, 165, 106, 0.35) 0%, rgba(198, 165, 106, 0.15) 100%)',
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                boxShadow: '0 0 15px rgba(198, 165, 106, 0.2)'
              }}
            >
              {loading ? 'Consulting Fate...' : `⚡ Invoke Clue · Stage ${activeMainQuestion.sequence_number || 1}`}
            </button>
          </div>
        )}

        {/* ACTIVE ARTIFACTS OR EMPTY STATE */}
        {activeInventory.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(8, 20, 36, 0.6) 0%, rgba(4, 12, 22, 0.75) 100%)',
            border: '1.5px dashed rgba(198, 165, 106, 0.3)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '10px',
            minHeight: '180px'
          }}>
            <span style={{ fontSize: '2rem', opacity: 0.45 }}>🏺</span>
            <div>
              <h4 style={{ fontFamily: 'var(--display)', color: 'rgba(231, 229, 221, 0.8)', margin: '0 0 6px 0', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                Sacred Reliquary Empty
              </h4>
              <p style={{ color: 'rgba(231, 229, 221, 0.65)', fontSize: '0.85rem', margin: 0, lineHeight: '1.45' }}>
                Conquer the Pre-Round Rituals on each island to earn mythical divine artifacts and blessings.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeInventory.map((item) => {
              const info = ARTIFACT_INFO[item.reward_type] || {
                icon: '⚡',
                title: REWARD_LABELS[item.reward_type] || item.reward_type,
                description: 'Divine mythical artifact.',
                targetRequired: false,
              };

              return (
                <div 
                  key={item.id} 
                  style={{
                    background: 'linear-gradient(135deg, rgba(14, 34, 58, 0.85) 0%, rgba(6, 17, 30, 0.95) 100%)',
                    border: '1.5px solid rgba(198, 165, 106, 0.5)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(198, 165, 106, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '90px',
                    height: '90px',
                    background: 'radial-gradient(circle, rgba(198, 165, 106, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 8px rgba(198, 165, 106, 0.6))' }}>
                        {info.icon}
                      </span>
                      <div>
                        <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: 0, fontSize: '1.15rem', letterSpacing: '0.04em' }}>
                          {info.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(137, 171, 118, 0.9)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                          ✦ Ready to Channel
                        </span>
                      </div>
                    </div>

                    <p style={{ color: 'rgba(231, 229, 221, 0.85)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {info.description}
                    </p>
                  </div>

                  <button 
                    type="button"
                    className="spoken-submit-btn"
                    onClick={() => setConfirmArtifact(item.reward_type)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      fontSize: '0.92rem',
                      margin: 0,
                      background: 'linear-gradient(180deg, rgba(137, 171, 118, 0.3) 0%, rgba(137, 171, 118, 0.1) 100%)',
                      borderColor: 'rgba(137, 171, 118, 0.7)',
                      color: '#a3e635',
                      boxShadow: '0 0 15px rgba(137, 171, 118, 0.25)'
                    }}
                  >
                    {loading ? 'Channeling...' : `⚡ Invoke ${info.title}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REWARD CONFIRMATION MODAL */}
      {confirmArtifact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(13, 27, 42, 0.98) 0%, rgba(5, 12, 22, 0.98) 100%)',
            border: '2px solid var(--gold)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px', filter: 'drop-shadow(0 0 12px rgba(198, 165, 106, 0.6))' }}>
              {ARTIFACT_INFO[confirmArtifact]?.icon || '⚡'}
            </span>
            <h3 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: '0 0 10px 0', fontSize: '1.4rem', letterSpacing: '0.04em' }}>
              Invoke {ARTIFACT_INFO[confirmArtifact]?.title || confirmArtifact}?
            </h3>
            <p style={{ color: 'rgba(231, 229, 221, 0.85)', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              {ARTIFACT_INFO[confirmArtifact]?.description}
              <br />
              <strong style={{ color: '#f87171', display: 'block', marginTop: '8px' }}>
                This artifact can only be used once on this island!
              </strong>
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setConfirmArtifact(null)}
                className="hero-action-btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInvokeArtifact(confirmArtifact)}
                className="spoken-submit-btn"
                style={{ flex: 1, margin: 0, padding: '10px' }}
                disabled={loading}
              >
                {loading ? 'Channeling...' : 'Confirm & Invoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RewardPanel;
