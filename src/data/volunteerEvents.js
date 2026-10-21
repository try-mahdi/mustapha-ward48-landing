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
    id: 'belthorn-canvassing',
    title: 'Canvassing in Belthorn',
    blurb: 'Meet at Kromboom Park.',
    location: 'Belthorn, Athlone',
    online: false,
    date: '2026-10-23',
    start: '15:00',
  },
  {
    id: 'gleemoor-canvassing',
    title: 'Canvassing in Gleemoor',
    blurb: 'Meet at Kromboom Park.',
    location: 'Gleemoor, Athlone',
    online: false,
    date: '2026-10-24',
    start: '11:00',
  },
  {
    id: 'athlone-canvassing',
    title: 'Canvassing in Athlone',
    blurb: 'Meet at Kromboom Park.',
    location: 'Athlone',
    online: false,
    date: '2026-10-25',
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
    title: 'Canvassing in ... Estate',
    location: '... Estate, Athlone',
    comingSoon: true,
  },
  {
    id: 'coming-soon-3',
    title: 'Canvassing in ... Estate',
    location: '... Estate, Athlone',
    comingSoon: true,
  },
  {
    id: 'coming-soon-4',
    title: 'Canvassing in ...',
    location: '..., Athlone',
    comingSoon: true,
  },
];
