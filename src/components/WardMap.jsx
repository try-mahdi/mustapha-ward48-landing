import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ward48 from '../data/ward48-2026.json';
import './WardMap.css';

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Kept in its own module so App can lazy-load it: Leaflet is the heaviest
// dependency on the page, and the map sits below the fold.
//
// `point` is a checked location ({ lat, lng, label }), `street` a searched
// street's lines ([[lng, lat], ...][]), and `onPick` fires with a clicked
// spot so visitors can tap their home.
function WardMap({ point, street, onPick }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    const map = L.map(containerRef.current, {
      // Don't hijack page scrolling, and on touch screens leave one-finger
      // swipes to the page — the zoom buttons still work, and a tap still
      // registers as a click.
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const ward = L.geoJSON(ward48, {
      style: {
        color: cssVar('--purple'),
        weight: 3,
        fillColor: cssVar('--gold'),
        fillOpacity: 0.3,
      },
      // Let clicks inside the ward fall through to the map's own handler.
      interactive: false,
    }).addTo(map);

    map.fitBounds(ward.getBounds(), { padding: [16, 16] });
    map.on('click', (event) => onPickRef.current?.(event.latlng));
    overlayRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const overlay = overlayRef.current;
    if (!map || !overlay) return;

    overlay.clearLayers();
    const bounds = L.geoJSON(ward48).getBounds();

    if (street) {
      const latLngs = street.map((line) => line.map(([lng, lat]) => [lat, lng]));
      // A wide light casing under the purple line keeps it readable over
      // both the gold ward fill and the grey basemap.
      L.polyline(latLngs, { color: cssVar('--white'), weight: 9, opacity: 0.9 }).addTo(overlay);
      L.polyline(latLngs, { color: cssVar('--purple-deep'), weight: 5 }).addTo(overlay);
      bounds.extend(L.latLngBounds(latLngs.flat()));
    }

    if (point) {
      L.circleMarker([point.lat, point.lng], {
        radius: 9,
        color: cssVar('--white'),
        weight: 3,
        fillColor: cssVar('--purple'),
        fillOpacity: 1,
      })
        .bindTooltip(point.label)
        .addTo(overlay);
      bounds.extend([point.lat, point.lng]);
    }

    // A tapped spot is already on screen, so don't yank the view around
    // while someone taps their way to the right house.
    if (!street && (!point || point.fromMap)) return;
    // Not animated: Leaflet silently drops a fitBounds that lands mid
    // zoom-animation, which would strand the map at the previous check's
    // zoom on a quick re-check.
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16, animate: false });
  }, [point, street]);

  return (
    <div
      ref={containerRef}
      className="ward-map__map"
      role="region"
      aria-label="Map of the Ward 48 boundary. Tap a spot to check whether it's in the ward."
    />
  );
}

export default WardMap;
