import { useMemo, useState } from 'react';
import './ElectionCountdown.css';

const ELECTION_DATE = new Date('2026-11-04T00:00:00');
const RING_RADIUS = 88;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const COUNTDOWN_WINDOW_DAYS = 365;

function daysUntilElection() {
  const diffMs = ELECTION_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function ElectionCountdown() {
  // Lazy initializer: reads the clock once, on mount, rather than on every render.
  const [daysLeft] = useState(daysUntilElection);

  const ringOffset = useMemo(() => {
    const fraction = Math.min(1, daysLeft / COUNTDOWN_WINDOW_DAYS);
    return RING_CIRCUMFERENCE * (1 - fraction);
  }, [daysLeft]);

  return (
    <div className="countdown">
      <p className="countdown__eyebrow">Election day</p>
      <h2 className="countdown__date">4 November 2026</h2>
      <div className="countdown__ring" role="img" aria-label={`${daysLeft} days until election day`}>
        <svg viewBox="0 0 200 200" className="countdown__ring-svg" aria-hidden="true">
          <circle cx="100" cy="100" r={RING_RADIUS} className="countdown__ring-track" />
          <circle
            cx="100"
            cy="100"
            r={RING_RADIUS}
            className="countdown__ring-progress"
            style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: ringOffset }}
          />
        </svg>
        <div className="countdown__ring-text" aria-hidden="true">
          <span className="countdown__days">{daysLeft}</span>
          <span className="countdown__unit">days</span>
        </div>
      </div>
    </div>
  );
}

export default ElectionCountdown;
