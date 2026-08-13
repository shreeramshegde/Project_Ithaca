import { useEffect, useMemo, useRef } from 'react';
import { animateScoreChange } from '../animations/scoreAnimations.js';

function formatYears(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  const numericValue = Number(value);
  return Number.isInteger(numericValue) ? `${numericValue}` : numericValue.toFixed(2);
}

function JourneyYears({ years, previousYears, flashValue }) {
  const valueRef = useRef(null);

  const change = useMemo(() => {
    if (flashValue !== undefined && flashValue !== null && flashValue !== '') {
      return Number(flashValue);
    }

    if (previousYears === null || previousYears === undefined || years === null || years === undefined) {
      return null;
    }

    const delta = Number(years) - Number(previousYears);
    return Number.isNaN(delta) || delta === 0 ? null : delta;
  }, [flashValue, previousYears, years]);

  useEffect(() => {
    if (change === null) {
      return;
    }
    animateScoreChange(valueRef.current, change < 0 ? 'positive' : 'negative');
  }, [change]);

  return (
    <section className="hud-panel years-card">
      <p className="eyebrow">Journey Time</p>
      <div ref={valueRef} className="years-value">
        {formatYears(years)}
      </div>
      <p className="years-label">Years Remaining</p>
      {change !== null ? (
        <div className={`years-delta ${change < 0 ? 'positive' : 'negative'}`}>
          {change > 0 ? '+' : ''}
          {change.toFixed(2)} YEARS
        </div>
      ) : (
        <div className="years-delta muted">Awaiting the next verdict</div>
      )}
    </section>
  );
}

export default JourneyYears;
