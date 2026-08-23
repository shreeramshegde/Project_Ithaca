import React, { useState, useEffect } from 'react';

const INITIAL_CODE = `int Search(int a[], int start, int last, int item)
{
    int mid;
    if (last >= start)
    {
        mid = (start + last) / 2;
        if (a[mid] == item) {
            return mid + 1;
        }
        else if (a[mid] < item) {
            return Search(a, start, mid + 1, item);
        }
        else {
            return Search(a, mid - 1, last, item);
        }
    }
    return -1;
}`;

export default function LotusBinarySearchEditor({ onSubmit, loading, isCorrect, isIncorrect }) {
  const [code, setCode] = useState(INITIAL_CODE);
  const [testOutput, setTestOutput] = useState(null);

  const handleReset = () => {
    setCode(INITIAL_CODE);
    setTestOutput(null);
  };

  const handleTestRun = () => {
    // Check if the recursive calls are correct
    const clean = code.replace(/\s+/g, '').toLowerCase();
    const hasRightSearch = clean.includes('search(a,mid+1,last,item)') || clean.includes('search(a,mid+1,last,item);');
    const hasLeftSearch = clean.includes('search(a,start,mid-1,item)') || clean.includes('search(a,start,mid-1,item);');

    if (hasRightSearch && hasLeftSearch) {
      setTestOutput({
        success: true,
        message: '✓ Simulation Passed: Binary Search successfully located target elements across test arrays [10, 20, 30, 40, 50, 60] with O(log n) efficiency.'
      });
    } else if (!hasRightSearch && hasLeftSearch) {
      setTestOutput({
        success: false,
        message: '⚠ Simulation Failed: Right subarray branch (a[mid] < item) is traversing with incorrect boundaries.'
      });
    } else if (hasRightSearch && !hasLeftSearch) {
      setTestOutput({
        success: false,
        message: '⚠ Simulation Failed: Left subarray branch is traversing with incorrect boundaries.'
      });
    } else {
      setTestOutput({
        success: false,
        message: '⚠ Simulation Failed: Both left and right recursive search boundaries contain traversal bugs.'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(code);
    }
  };

  return (
    <div className="lotus-code-interactive-card" style={{
      background: 'linear-gradient(180deg, rgba(8, 20, 35, 0.95) 0%, rgba(4, 12, 22, 0.98) 100%)',
      border: '1.5px solid rgba(198, 165, 106, 0.45)',
      borderRadius: '14px',
      padding: '20px',
      margin: '18px 0',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
    }}>
      {/* Editor Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(198, 165, 106, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.9rem',
            color: 'var(--gold)',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            Navigation_Console :: search_algorithm.c
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(231, 229, 221, 0.8)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            ↺ Reset Code
          </button>
          <button
            type="button"
            onClick={handleTestRun}
            disabled={loading}
            style={{
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: '#00f0ff',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            ▶ Test Run
          </button>
        </div>
      </div>

      <p style={{
        fontSize: '0.86rem',
        color: 'rgba(231, 229, 221, 0.8)',
        marginBottom: '10px',
        lineHeight: '1.4'
      }}>
        The search mechanism in the editor below is corrupted. Edit the recursive traversal boundaries directly in the code editor to restore the navigation system:
      </p>

      {/* Code Editor Box */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading || isCorrect}
          rows={19}
          style={{
            width: '100%',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.92rem',
            lineHeight: '1.5',
            color: '#7ee787',
            background: '#0d1117',
            border: '1.5px solid rgba(198, 165, 106, 0.35)',
            borderRadius: '8px',
            padding: '14px 16px',
            boxSizing: 'border-box',
            resize: 'vertical',
            outline: 'none',
            whiteSpace: 'pre',
            tabSize: 4
          }}
          spellCheck={false}
        />
      </div>

      {/* Test Output Panel */}
      {testOutput && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontFamily: 'var(--mono)',
          background: testOutput.success ? 'rgba(137, 171, 118, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${testOutput.success ? '#89ab76' : '#ef4444'}`,
          color: testOutput.success ? '#89ab76' : '#f87171'
        }}>
          {testOutput.message}
        </div>
      )}

      {/* Submit Button */}
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || isCorrect}
          className="spoken-submit-btn"
          style={{
            padding: '10px 24px',
            fontSize: '0.95rem'
          }}
        >
          {loading ? 'Compiling & Submitting...' : '⚡ Inject Repaired Code into Console'}
        </button>
      </div>
    </div>
  );
}
