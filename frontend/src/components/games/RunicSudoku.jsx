import React, { useState } from 'react';

// 6x6 Medium Greek Runic Sudoku for Circe's Arcane Sanctum (Numbers 1-6 with 2x3 blocks)
function RunicSudoku({ onSolve, isSolved = false }) {
  // 6x6 Medium Sudoku
  // 0 = empty cell
  const INITIAL_GRID = [
    [1, 0, 0, 0, 5, 0],
    [0, 0, 3, 0, 0, 2],
    [0, 1, 0, 4, 0, 0],
    [0, 0, 4, 0, 2, 0],
    [3, 0, 0, 5, 0, 0],
    [0, 4, 0, 0, 0, 6],
  ];

  const FIXED_CELLS = [
    [true, false, false, false, true, false],
    [false, false, true, false, false, true],
    [false, true, false, true, false, false],
    [false, false, true, false, true, false],
    [true, false, false, true, false, false],
    [false, true, false, false, false, true],
  ];

  const SOLUTION = [
    [1, 2, 6, 3, 5, 4],
    [4, 5, 3, 6, 1, 2],
    [2, 1, 5, 4, 6, 3],
    [6, 3, 4, 1, 2, 5],
    [3, 6, 2, 5, 4, 1],
    [5, 4, 1, 2, 3, 6],
  ];

  const [grid, setGrid] = useState(INITIAL_GRID);
  const [selectedCell, setSelectedCell] = useState([0, 1]); // default to first editable cell
  const [errorMsg, setErrorMsg] = useState(null);

  const GLYPH_MAP = {
    0: '·',
    1: 'α (1)',
    2: 'β (2)',
    3: 'γ (3)',
    4: 'δ (4)',
    5: 'ε (5)',
    6: 'ζ (6)',
  };

  const handleCellClick = (r, c) => {
    setSelectedCell([r, c]);
    setErrorMsg(null);
  };

  const setCellValue = (r, c, num) => {
    if (FIXED_CELLS[r][c] || isSolved) return;
    setErrorMsg(null);
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
  };

  // Keyboard navigation & direct 1-6 entry
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSolved || !selectedCell) return;
      const [r, c] = selectedCell;

      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        setCellValue(r, c, parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        setCellValue(r, c, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell([Math.min(5, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell([r, Math.min(5, c + 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid, isSolved]);

  const handleVerify = () => {
    let isValid = true;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
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
      setErrorMsg('The runic energies clash! Check rows, columns, and 2x3 blocks for duplicate symbols.');
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
          Circe's 6x6 Runic Sudoku
        </h4>
      </div>
      <p style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
        Select any cell and press <strong>1–6</strong> on your keyboard (or use the number bar below). Use Arrow keys to navigate.
      </p>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '4px',
          maxWidth: '380px',
          margin: '0 auto 16px auto',
          background: 'rgba(5, 10, 20, 0.95)',
          padding: '10px',
          borderRadius: '12px',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.2)'
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isFixed = FIXED_CELLS[r][c];
            const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
            const borderRight = (c === 2) ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.2)';
            const borderBottom = (r === 1 || r === 3) ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.2)';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  aspectRatio: '1',
                  background: isSelected
                    ? 'rgba(168, 85, 247, 0.45)'
                    : isFixed 
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
                  outline: isSelected ? '2px solid var(--gold)' : 'none',
                  boxShadow: isSelected ? '0 0 12px rgba(234, 179, 8, 0.6)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {val !== 0 ? GLYPH_MAP[val] : '·'}
              </div>
            );
          })
        )}
      </div>

      {/* Number Input Keypad Bar */}
      {!solved && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          maxWidth: '380px',
          margin: '0 auto 16px auto',
          flexWrap: 'wrap'
        }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                if (selectedCell) setCellValue(selectedCell[0], selectedCell[1], num);
              }}
              style={{
                flex: '1 1 45px',
                minWidth: '45px',
                padding: '8px 0',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                color: 'var(--gold)',
                borderRadius: '8px',
                fontFamily: 'var(--display)',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (selectedCell) setCellValue(selectedCell[0], selectedCell[1], 0);
            }}
            style={{
              padding: '8px 12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#f87171',
              borderRadius: '8px',
              fontFamily: 'var(--display)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Clear (⌫)
          </button>
        </div>
      )}

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
