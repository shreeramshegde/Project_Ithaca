import React, { useState } from 'react';

// 4x4 Greek Mini Sudoku for Circe's Arcane Sanctum (Numbers 1, 2, 3, 4)
function RunicSudoku({ onSolve, isSolved = false }) {
  // 0 represents empty cell
  // Initial puzzle:
  // [1, 0, 0, 4]
  // [0, 0, 3, 1]
  // [2, 4, 0, 0]
  // [3, 0, 0, 2]
  // Solution:
  // [1, 3, 2, 4]
  // [4, 2, 3, 1]
  // [2, 4, 1, 3]
  // [3, 1, 4, 2]

  const INITIAL_GRID = [
    [1, 0, 0, 4],
    [0, 0, 3, 1],
    [2, 4, 0, 0],
    [3, 0, 0, 2],
  ];

  const FIXED_CELLS = [
    [true, false, false, true],
    [false, false, true, true],
    [true, true, false, false],
    [true, false, false, true],
  ];

  const SOLUTION = [
    [1, 3, 2, 4],
    [4, 2, 3, 1],
    [2, 4, 1, 3],
    [3, 1, 4, 2],
  ];

  const [grid, setGrid] = useState(INITIAL_GRID);
  const [errorMsg, setErrorMsg] = useState(null);

  const GLYPH_MAP = {
    0: '·',
    1: 'α (1)',
    2: 'β (2)',
    3: 'γ (3)',
    4: 'δ (4)',
  };

  const handleCellClick = (r, c) => {
    if (FIXED_CELLS[r][c] || isSolved) return;

    setErrorMsg(null);
    const newGrid = grid.map(row => [...row]);
    // Cycle from 0 -> 1 -> 2 -> 3 -> 4 -> 0
    newGrid[r][c] = (newGrid[r][c] + 1) % 5;
    if (newGrid[r][c] === 0) newGrid[r][c] = 1; // cycle 1-4 directly

    setGrid(newGrid);
  };

  const handleVerify = () => {
    let isValid = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] !== SOLUTION[r][c]) {
          isValid = false;
          break;
        }
      }
    }

    if (isValid) {
      setErrorMsg(null);
      if (onSolve) onSolve();
    } else {
      setErrorMsg('The runic energies clash! Check rows, columns, and 2x2 quadrants for duplicate symbols.');
    }
  };

  const solved = isSolved;

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(25, 12, 38, 0.95) 0%, rgba(10, 5, 20, 0.98) 100%)',
      border: '1.5px solid #a855f7',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      textAlign: 'center',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.8rem' }}>🔮</span>
        <h4 style={{ fontFamily: 'var(--display)', color: '#c084fc', margin: 0, fontSize: '1.25rem' }}>
          Circe's 4x4 Runic Sudoku
        </h4>
      </div>
      <p style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
        Click empty cells to cycle runes (α, β, γ, δ / 1–4) such that every row, column, and 2x2 quadrant contains each rune exactly once.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        maxWidth: '300px',
        margin: '0 auto 16px auto',
        padding: '10px',
        background: 'rgba(3, 7, 18, 0.85)',
        borderRadius: '12px',
        border: '1px solid rgba(168, 85, 247, 0.4)'
      }}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isFixed = FIXED_CELLS[r][c];
            // 2x2 boundary borders
            const borderRight = (c === 1) ? '2px solid rgba(168, 85, 247, 0.8)' : '1px solid rgba(168, 85, 247, 0.2)';
            const borderBottom = (r === 1) ? '2px solid rgba(168, 85, 247, 0.8)' : '1px solid rgba(168, 85, 247, 0.2)';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  aspectRatio: '1',
                  background: isFixed 
                    ? 'rgba(168, 85, 247, 0.18)' 
                    : val !== 0 
                      ? 'linear-gradient(135deg, rgba(192, 132, 252, 0.3) 0%, rgba(10, 5, 20, 0.9) 100%)' 
                      : 'rgba(255, 255, 255, 0.04)',
                  borderRight,
                  borderBottom,
                  borderTop: '1px solid rgba(168, 85, 247, 0.2)',
                  borderLeft: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--display)',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: isFixed ? '#c084fc' : (val !== 0 ? 'var(--gold)' : 'rgba(255,255,255,0.2)'),
                  cursor: isFixed || isSolved ? 'default' : 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {val !== 0 ? GLYPH_MAP[val] : '·'}
              </div>
            );
          })
        )}
      </div>

      {errorMsg && (
        <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '14px' }}>
          ⚠ {errorMsg}
        </div>
      )}

      {solved ? (
        <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.05rem', fontFamily: 'var(--display)' }}>
          ✓ Circe's Runic Matrix is balanced! Transmutation dispelled.
        </div>
      ) : (
        <button
          type="button"
          onClick={handleVerify}
          className="spoken-submit-btn"
          style={{ maxWidth: '240px', margin: '0 auto', background: 'linear-gradient(180deg, #7e22ce 0%, #581c87 100%)', borderColor: '#a855f7' }}
        >
          🔮 Cast Runic Seal
        </button>
      )}
    </div>
  );
}

export default RunicSudoku;
