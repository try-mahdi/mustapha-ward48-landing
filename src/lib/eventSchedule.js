// Scheduling helpers for the volunteer events list (data in
// src/data/volunteerEvents.js): turns each event's date/time strings into
// the badge and "when" line the cards show.

// Built once at module scope — constructing an Intl formatter is far more
// expensive than calling one, and these never vary.
const DAY_FORMAT = new Intl.DateTimeFormat('en-ZA', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
const TIME_FORMAT = new Intl.DateTimeFormat('en-ZA', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayDiff(date, from) {
  return Math.round((startOfDay(date) - startOfDay(from)) / 86_400_000);
}

function relativeBadge(date, now) {
  const diff = dayDiff(date, now);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 6) return 'This week';
  return 'Upcoming';
}

// "YYYY-MM-DD" + "HH:MM" → a local Date. Built from parts rather than
// `new Date(string)`, whose handling of date-only/zone-less strings varies.
function toDate(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

// Adds the display fields derived from `start`/`end`, drops events whose
// calendar day has already passed (so old entries never have to be deleted
// for the list to stay current), and sorts what's left soonest-first.
// Coming-soon events have no date yet, so they follow in the order listed.
export function decorateEvents(rawEvents, now = new Date()) {
  const scheduled = rawEvents
    .filter((event) => !event.comingSoon)
    .map((event) => ({
      ...event,
      start: toDate(event.date, event.start),
      end: event.end ? toDate(event.date, event.end) : null,
    }))
    .filter((event) => dayDiff(event.start, now) >= 0)
    .sort((a, b) => a.start - b.start)
    .map((event) => ({
      ...event,
      badge: relativeBadge(event.start, now),
      dateTime: event.start.toISOString(),
      when: event.end
        ? `${DAY_FORMAT.format(event.start)} · ${TIME_FORMAT.format(event.start)} – ${TIME_FORMAT.format(event.end)}`
        : `${DAY_FORMAT.format(event.start)} · ${TIME_FORMAT.format(event.start)}`,
    }));
  const comingSoon = rawEvents.filter((event) => event.comingSoon);
  return [...scheduled, ...comingSoon];
}
