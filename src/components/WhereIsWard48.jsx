import { lazy, Suspense, useState } from 'react';
import ward48 from '../data/ward48-2026.json';
import Button from './Button.jsx';
import './WhereIsWard48.css';

const WardMap = lazy(() => import('./WardMap.jsx'));

// Largest first, from the City of Cape Town's Official Planning Suburbs
// layer intersected with the 2026 boundary (slivers under 1% left out, and
// Crawford left out at the campaign's request).
const SUBURBS = [
  'Athlone',
  'Belthorn Estate',
  'Belgravia',
  'Pinati Estate',
  'Penlyn Estate',
  'Mountview',
];

function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function isInWard48(lat, lng) {
  const { type, coordinates } = ward48.geometry;
  const polygons = type === 'Polygon' ? [coordinates] : coordinates;
  const point = [lng, lat];
  return polygons.some(
    ([outer, ...holes]) => inRing(point, outer) && !holes.some((hole) => inRing(point, hole)),
  );
}

const MESSAGES = {
  locating: 'Finding your location…',
  inside: "Yes — you're in Ward 48. Your vote on 4 November decides who represents you.",
  outside:
    "You're outside Ward 48 right now. If you live or are registered in the ward, you can still vote here.",
  denied: "We couldn't get your location. Check your browser's location permission and try again.",
  unsupported: "Your browser can't share its location, but the map shows the full ward boundary.",
};

function WhereIsWard48() {
  const [status, setStatus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // The location is only used here in the browser to check it against the
  // boundary — it's never sent anywhere.
  function checkLocation() {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(location);
        setStatus(isInWard48(location.lat, location.lng) ? 'inside' : 'outside');
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section className="ward48" id="where-is-ward-48" aria-labelledby="ward48-heading">
      <div className="ward48__grid">
        <div className="ward48__text">
          <p className="ds-eyebrow ward48__eyebrow">Know your ward</p>
          <h2 id="ward48-heading" className="ward48__title">
            Where is Ward 48?
          </h2>
          <p className="ward48__body">
            Ward 48 takes in Athlone, Belthorn Estate, Belgravia, Pinati Estate and Penlyn Estate,
            along with part of Mountview.
          </p>

          <ul className="ward48__suburbs" aria-label="Suburbs in Ward 48">
            {SUBURBS.map((suburb) => (
              <li key={suburb}>{suburb}</li>
            ))}
          </ul>

          <Button
            variant="accent"
            onClick={checkLocation}
            disabled={status === 'locating'}
            className="ward48__check"
          >
            Am I in Ward 48?
          </Button>
          <p className="ward48__status" aria-live="polite">
            {status && MESSAGES[status]}
          </p>

          <p className="ward48__source">
            Boundary for the 4 November 2026 local elections, from the Municipal Demarcation Board.
          </p>
        </div>

        <div className="ward48__map-card">
          <Suspense fallback={<div className="ward48__map-loading">Loading map…</div>}>
            <WardMap userLocation={userLocation} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export default WhereIsWard48;
