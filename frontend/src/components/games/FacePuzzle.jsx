import React, { useState } from 'react';

function FacePuzzle({ onSolve, isSolved = false }) {
  const [tiles, setTiles] = useState([4, 1, 3, 7, 2, 6, 5, 8, 9]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const TILE_DATA = {
    1: { label: 'Forehead & Crest', glyph: '🪖', bg: '#3a2312' },
    2: { label: 'Brow of Ithaca', glyph: '⚡', bg: '#482c16' },
    3: { label: 'Golden Lock', glyph: '⚜', bg: '#3d2514' },
    4: { label: 'Left Piercing Eye', glyph: '👁', bg: '#4d3019' },
    5: { label: 'Noble Nose Bridge', glyph: '🏛', bg: '#5c3a1e' },
    6: { label: 'Right Keen Eye', glyph: '👁', bg: '#4d3019' },
    7: { label: 'Beard of Troy', glyph: '⚓', bg: '#301c0d' },
    8: { label: 'Determined Jaw', glyph: '🔱', bg: '#382110' },
    9: { label: 'Chlamys Clasp', glyph: '🛡', bg: '#2b170a' },
  };

  const checkSolved = (currentTiles) => {
    return currentTiles.every((val, idx) => val === idx + 1);
  };

  const handleTileClick = (idx) => {
    if (isSolved) return;

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[idx];
      newTiles[idx] = temp;

      setTiles(newTiles);
      setSelectedIdx(null);

      if (checkSolved(newTiles)) {
        if (onSolve) onSolve();
      }
    }
  };

  const solved = isSolved || checkSolved(tiles);

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(12, 25, 42, 0.95) 0%, rgba(5, 12, 22, 0.98) 100%)',
      border: '1.5px solid var(--gold)',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      textAlign: 'center',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.8rem' }}>🧩</span>
        <h4 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', margin: 0, fontSize: '1.25rem' }}>
          Mosaic of the Wanderer (Face of Odysseus)
        </h4>
      </div>
      <p style={{ color: 'rgba(231, 229, 221, 0.75)', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
        Click any two shards to swap their positions until Odysseus's facial mosaic is restored (1 through 9).
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        maxWidth: '340px',
        margin: '0 auto 16px auto',
        padding: '10px',
        background: 'rgba(3, 7, 18, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(198, 165, 106, 0.3)'
      }}>
        {tiles.map((num, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectPos = num === idx + 1;
          const data = TILE_DATA[num] || { glyph: '◈', label: `Shard ${num}`, bg: '#333' };

          return (
            <div
              key={idx}
              onClick={() => handleTileClick(idx)}
              style={{
                aspectRatio: '1',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(198, 165, 106, 0.4) 0%, rgba(7, 21, 38, 0.95) 100%)' 
                  : isCorrectPos && solved
                    ? 'linear-gradient(135deg, rgba(137, 171, 118, 0.3) 0%, rgba(7, 21, 38, 0.95) 100%)'
                    : `linear-gradient(135deg, ${data.bg} 0%, #150d06 100%)`,
                border: isSelected 
                  ? '2px solid #00f0ff' 
                  : isCorrectPos && solved
                    ? '2px solid var(--success)'
                    : '1.5px solid rgba(198, 165, 106, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: solved ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected ? '0 0 15px rgba(0, 240, 255, 0.5)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.6rem', marginBottom: '2px' }}>{data.glyph}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(231, 229, 221, 0.7)', fontWeight: 'bold' }}>
                Shard {num}
              </span>
            </div>
          );
        })}
      </div>

      {solved ? (
        <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.05rem', fontFamily: 'var(--display)' }}>
          ✓ Odysseus's true countenance is restored! The Sirens' illusion shatters.
        </div>
      ) : (
        <div style={{ fontSize: '0.82rem', color: 'var(--gold)', opacity: 0.8 }}>
          {selectedIdx !== null ? `Shard ${tiles[selectedIdx]} selected — now click another shard to swap` : 'Click a shard to begin swap'}
        </div>
      )}
    </div>
  );
}

export default FacePuzzle;
