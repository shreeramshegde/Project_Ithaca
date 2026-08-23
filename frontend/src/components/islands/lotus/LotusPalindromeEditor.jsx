import React, { useState } from 'react';

const INITIAL_CODE = `void palindrome(int number)
{
    int rev = 0, store, n1, left;
    n1 = number;
    store = number;
    while (number > 0)
    {
        left = number / 10;
        rev = rev + 10 * left;
        number = number % 10;
    }
    if (n1 == rev)
        printf("Number %d is Palindrome number", n1);
    else
        printf("it is not a Palindrome number");
}`;

export default function LotusPalindromeEditor({ onSubmit, loading, isCorrect, isIncorrect }) {
  const [code, setCode] = useState(INITIAL_CODE);
  const [testOutput, setTestOutput] = useState(null);

  const handleReset = () => {
    setCode(INITIAL_CODE);
    setTestOutput(null);
  };

  const handleTestRun = () => {
    const clean = code.replace(/\s+/g, '').toLowerCase();
    const hasModuloDigit = clean.includes('left=number%10') || clean.includes('left=num%10');
    const hasAccumulator = clean.includes('rev=rev*10+left') || clean.includes('rev=(rev*10)+left') || clean.includes('rev=10*rev+left');
    const hasReduction = clean.includes('number=number/10') || clean.includes('number/=10');

    if (hasModuloDigit && hasAccumulator && hasReduction) {
      setTestOutput({
        success: true,
        message: '✓ Simulation Passed: Palindrome verification passed all test numbers (121 -> Palindrome, 12321 -> Palindrome, 1234 -> Not Palindrome).'
      });
    } else {
      const errors = [];
      if (!hasModuloDigit) errors.push('Digit extraction is dividing instead of extracting remainder with modulo (left = number % 10)');
      if (!hasAccumulator) errors.push('Reversal accumulator formula is incorrect (rev = rev * 10 + left)');
      if (!hasReduction) errors.push('Number reduction is taking modulo instead of integer division (number = number / 10)');

      setTestOutput({
        success: false,
        message: `⚠ Simulation Failed: ${errors.join('; ')}.`
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
      border: '1.5px solid rgba(239, 68, 68, 0.5)',
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
        borderBottom: '1px solid rgba(239, 68, 68, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.9rem',
            color: '#f87171',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            Penalty_Inscription_3 :: palindrome_lock.c
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
              background: 'rgba(248, 113, 113, 0.18)',
              border: '1px solid rgba(248, 113, 113, 0.5)',
              color: '#fca5a5',
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
        color: 'rgba(231, 229, 221, 0.85)',
        marginBottom: '10px',
        lineHeight: '1.4'
      }}>
        The palindrome verification code contains an extraction bug inside the <code style={{ color: '#fca5a5' }}>while</code> loop. Edit and repair the code below, then test run and inject the fix to lift the penalty:
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
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
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
            fontSize: '0.95rem',
            borderColor: '#ef4444',
            color: '#f87171',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)'
          }}
        >
          {loading ? 'Compiling & Submitting...' : '⚡ Inject Fixed Code to Unlock Checkpoint'}
        </button>
      </div>
    </div>
  );
}
