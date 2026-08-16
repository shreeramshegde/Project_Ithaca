import React from 'react';
import { ISLANDS } from '../../data/islands.js';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content cinematic-panel rules-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-symbol">📜</span>
          <h3 className="modal-title">Project Ithaca — Event Rules & Mechanics</h3>
        </div>

        <div className="modal-body rules-scrollable">
          <section className="rule-section">
            <h4>⚡ Core Mechanic: Time is Currency</h4>
            <p>
              Every team embarks with a <strong>20.0-Year Journey</strong>. Correct answers reduce your remaining journey time, while incorrect answers increase it. The team with the <strong>lowest remaining journey duration</strong> wins!
            </p>
          </section>

          <section className="rule-section">
            <h4>🏆 Judging & Tie-Breakers</h4>
            <ol>
              <li><strong>Primary Metric</strong>: Lowest Remaining Journey Years.</li>
              <li><strong>Tie-Breaker 1</strong>: Fastest total completion duration (Start to Finish).</li>
              <li><strong>Tie-Breaker 2</strong>: Most standard hints remaining (starts at 3).</li>
            </ol>
          </section>

          <section className="rule-section">
            <h4>🗺️ Island-by-Island Structure</h4>
            <div className="rules-table-wrapper">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Island</th>
                    <th>Pre-Round GK Reward</th>
                    <th>Format</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                  </tr>
                </thead>
                <tbody>
                  {ISLANDS.filter((i) => i.id <= 4).map((island) => (
                    <tr key={island.id}>
                      <td><strong>{island.name}</strong></td>
                      <td>
                        <strong>{island.rewardName}</strong>
                        <br />
                        <small>{island.rewardDescription}</small>
                      </td>
                      <td>{island.pathLabel}</td>
                      <td style={{ color: 'var(--success)' }}>{island.scoring.correct} yr</td>
                      <td style={{ color: 'var(--danger)' }}>+{island.scoring.incorrect} yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rule-section">
            <h4>💡 Hints & Artifacts</h4>
            <ul>
              <li><strong>Standard Hints</strong>: Every team starts with 3 hints for the entire journey.</li>
              <li><strong>Athena's Scroll (Island 1)</strong>: Grants +1 free hint usable in Island 1 without using your standard 3 hints.</li>
              <li><strong>Cyclops Eye (Island 2)</strong>: Striking this rune eliminates 1 wrong option in an MCQ.</li>
              <li><strong>Hermes' Sandals (Island 3)</strong>: Instantly subtracts 2.0 years from your journey. (Beware: Trap option adds +2.0 years!)</li>
              <li><strong>The Blessing (Island 4)</strong>: Choice to either bypass Circe's sit-out curse or subtract 3.0 years.</li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button className="action-button cinematic-button" onClick={onClose}>
            Close Rules
          </button>
        </div>
      </div>
    </div>
  );
}
