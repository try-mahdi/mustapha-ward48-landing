import { lazy, Suspense, useState } from 'react';
import ward48 from '../data/ward48-2026.json';
import StreetSearch from './StreetSearch.jsx';
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


const REGISTRATION_URL = 'https://registertovote.elections.org.za/';

const GPS_MESSAGES = {
  locating: 'Finding your location…',
  inside: "Yes — you're in Ward 48. Your vote on 4 November decides who represents you.",
  outside:
    "You're outside Ward 48 right now. If you live or are registered in the ward, you can still vote here.",
  denied: "We couldn't get your location. Check your browser's location permission and try again.",
  unsupported: "Your browser can't share its location — search your street or tap the map instead.",
};

function streetMessage(street) {
  if (street.s === 'in') return `Yes — ${street.n} is in Ward 48.`;
  if (street.s === 'out') return `${street.n} is outside Ward 48.`;
  return `${street.n} crosses the Ward 48 boundary, so it depends which end you live on. It's highlighted on the map — tap your home to check.`;
}

function WhereIsWard48() {
  const [message, setMessage] = useState(null);
  const [locating, setLocating] = useState(false);
  const [point, setPoint] = useState(null);
  const [street, setStreet] = useState(null);

  // Every check below happens here in the browser against the boundary —
  // no location, street or tapped spot is ever sent anywhere.
  function checkLocation() {
    if (!('geolocation' in navigator)) {
      setMessage(GPS_MESSAGES.unsupported);
      return;
    }
    setLocating(true);
    setMessage(GPS_MESSAGES.locating);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude, label: 'You are here' };
        setLocating(false);
        setStreet(null);
        setPoint(location);
        setMessage(GPS_MESSAGES[isInWard48(location.lat, location.lng) ? 'inside' : 'outside']);
      },
      () => {
        setLocating(false);
        setMessage(GPS_MESSAGES.denied);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function pickStreet(chosen) {
    setPoint(null);
    setStreet(chosen.g);
    setMessage(streetMessage(chosen));
  }

  function pickSpot({ lat, lng }) {
    const inside = isInWard48(lat, lng);
    setPoint({ lat, lng, label: 'Your spot', fromMap: true });
    setMessage(inside ? 'That spot is in Ward 48.' : 'That spot is outside Ward 48.');
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

          <div className="ward48__check">
            <StreetSearch
              onSelect={pickStreet}
              onNoMatch={(query) =>
                setMessage(
                  `We couldn't find "${query}" near Ward 48. Check the spelling, or tap your home on the map instead.`,
                )
              }
            />
            <p className="ward48__hint">
              Or tap your home on the map, or{' '}
              <button
                type="button"
                className="ward48__link-button"
                onClick={checkLocation}
                disabled={locating}
              >
                use my current location
              </button>
              .
            </p>
          </div>

          <p className="ward48__status" aria-live="polite">
            {message}
          </p>

          <p className="ward48__source">
            Your voting ward is set by the address you&rsquo;re registered at.{' '}
            <a href={REGISTRATION_URL} target="_blank" rel="noreferrer">
              Check or update your registration with the IEC
            </a>
            . Boundary for the 4 November 2026 local elections, from the Municipal Demarcation
            Board; streets from OpenStreetMap.
          </p>
        </div>

        <div className="ward48__map-card">
          <Suspense fallback={<div className="ward48__map-loading">Loading map…</div>}>
            <WardMap point={point} street={street} onPick={pickSpot} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export default WhereIsWard48;
