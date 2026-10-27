// The campaign's volunteer events. To add, change or remove one, edit this
// list — dates are `YYYY-MM-DD`, times 24-hour `HH:MM` (local time), and
// `end` is optional. Past events drop off the page on their own once their
// day is over, so old entries can stay here until they're tidied away.
//
// `comingSoon: true` shows an event as a locked "coming soon" card after the
// dated ones: it needs no date or time, and can't be signed up for yet. To
// open it up, remove the flag and give it a `date` and `start`.
export const VOLUNTEER_EVENTS = [
  {
    id: 'mountview-canvassing',
    title: 'Canvassing in Mountview',
    blurb: 'Meet at the Engen petrol station, Bellmore Avenue.',
    location: 'Mountview, Athlone',
    online: false,
    date: '2026-10-27',
    start: '15:00',
  },
  {
    id: 'penlyn-estate-canvassing',
    title: 'Canvassing in Penlyn Estate',
    blurb: 'Meet at the Astron petrol station, Belgravia Road.',
    location: 'Penlyn Estate, Athlone',
    online: false,
    date: '2026-10-28',
    start: '15:00',
  },
  {
    id: 'belgravia-canvassing',
    title: 'Canvassing in Belgravia',
    blurb: 'Meeting place to be announced.',
    location: 'Belgravia, Athlone',
    online: false,
    date: '2026-10-29',
    start: '15:00',
  },
  {
    id: 'athlone-canvassing-oct-30',
    title: 'Canvassing in Athlone',
    blurb: 'Meet at Kromboom Park.',
    location: 'Athlone',
    online: false,
    date: '2026-10-30',
    start: '15:00',
  },
  {
    id: 'crawford-canvassing',
    title: 'Canvassing in Crawford',
    blurb: 'Meet at Kromboom Park.',
    location: 'Crawford, Athlone',
    online: false,
    date: '2026-10-31',
    start: '11:00',
  },
  {
    id: 'coming-soon-1',
    title: 'Canvassing in ...',
    location: '..., Athlone',
    comingSoon: true,
  },
  {
    id: 'coming-soon-2',
    title: 'Canvassing in ...',
    location: '..., Athlone',
    comingSoon: true,
  },
  {
    id: 'coming-soon-3',
    title: 'Canvassing in ...',
    location: '..., Athlone',
    comingSoon: true,
  },
  {
    id: 'coming-soon-4',
    title: 'Canvassing in ...',
    location: '..., Athlone',
    comingSoon: true,
  },
];
