import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ward48 from '../data/ward48-2026.json';
import './WardMap.css';

// Kept in its own module so App can lazy-load it: Leaflet is the heaviest
// dependency on the page, and the map sits below the fold.
function WardMap({ userLocation }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(containerRef.current, {
      // Don't hijack page scrolling, and on touch screens leave one-finger
      // swipes to the page — the zoom buttons still work.
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const styles = getComputedStyle(document.documentElement);
    const ward = L.geoJSON(ward48, {
      style: {
        color: styles.getPropertyValue('--purple').trim(),
        weight: 3,
        fillColor: styles.getPropertyValue('--gold').trim(),
        fillOpacity: 0.3,
      },
    }).addTo(map);

    map.fitBounds(ward.getBounds(), { padding: [16, 16] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current?.remove();
    markerRef.current = null;
    if (!userLocation) return;

    const styles = getComputedStyle(document.documentElement);
    markerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
      radius: 9,
      color: styles.getPropertyValue('--white').trim(),
      weight: 3,
      fillColor: styles.getPropertyValue('--purple').trim(),
      fillOpacity: 1,
    })
      .bindTooltip('You are here')
      .addTo(map);

    // Keep the whole ward in view when they're inside it; widen out to
    // include them when they're somewhere else. Not animated: Leaflet
    // silently drops a fitBounds that lands mid zoom-animation, which would
    // strand the map at the previous check's zoom on a quick re-check.
    const bounds = L.geoJSON(ward48).getBounds().extend([userLocation.lat, userLocation.lng]);
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15, animate: false });
  }, [userLocation]);

  return (
    <div
      ref={containerRef}
      className="ward-map__map"
      role="region"
      aria-label="Map of the Ward 48 boundary"
    />
  );
}

export default WardMap;
