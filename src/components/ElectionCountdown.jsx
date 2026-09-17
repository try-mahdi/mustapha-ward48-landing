import { useEffect, useMemo, useState } from 'react';
import './ElectionCountdown.css';

const ELECTION_DATE = new Date('2026-11-04T00:00:00');
const RING_RADIUS = 88;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const COUNTDOWN_WINDOW_DAYS = 365;

function timeUntilElection() {
  const diffMs = Math.max(0, ELECTION_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    seconds: Math.floor((diffMs / 1000) % 60),
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function ElectionCountdown() {
  const [timeLeft, setTimeLeft] = useState(timeUntilElection);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(timeUntilElection()), 1000);
    return () => clearInterval(id);
  }, []);

  const ringOffset = useMemo(() => {
    const fraction = Math.min(1, timeLeft.days / COUNTDOWN_WINDOW_DAYS);
    return RING_CIRCUMFERENCE * (1 - fraction);
  }, [timeLeft.days]);

  return (
    <div className="countdown">
      <p className="countdown__eyebrow">Election day</p>
      <h2 className="countdown__date">4 November 2026</h2>
      <div
        className="countdown__ring"
        role="img"
        aria-label={`${timeLeft.days} days until election day`}
      >
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
          <span className="countdown__days">{timeLeft.days}</span>
          <span className="countdown__unit">days</span>
        </div>
      </div>
      <div className="countdown__tiles" aria-hidden="true">
        <div className="countdown__tile">
          <span className="countdown__tile-value">{pad(timeLeft.hours)}</span>
          <span className="countdown__tile-label">Hours</span>
        </div>
        <div className="countdown__tile">
          <span className="countdown__tile-value">{pad(timeLeft.minutes)}</span>
          <span className="countdown__tile-label">Mins</span>
        </div>
        <div className="countdown__tile">
          <span className="countdown__tile-value">{pad(timeLeft.seconds)}</span>
          <span className="countdown__tile-label">Secs</span>
        </div>
      </div>
    </div>
  );
}

export default ElectionCountdown;
