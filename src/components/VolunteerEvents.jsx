import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import iconAthloneStadium from '../assets/icons/athlone-stadium-on-purple.svg';
import iconDums from '../assets/icons/dums-on-purple.svg';
import iconTaxi from '../assets/icons/taxi-on-purple.svg';
import iconSamoosa from '../assets/icons/samoosa-on-purple.svg';
import iconPlasticChair from '../assets/icons/plastic-chair-on-purple.svg';
import iconKlopseHeadgear from '../assets/icons/klopse-headgear-on-purple.svg';
import iconGatsby from '../assets/icons/gatsby-on-purple.svg';
import { VOLUNTEER_EVENTS } from '../data/volunteerEvents.js';
import { decorateEvents } from '../lib/eventSchedule.js';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import IconButton from './IconButton.jsx';
import Modal from './Modal.jsx';
import VolunteerForm from './VolunteerForm.jsx';
import './VolunteerEvents.css';

const BAND_ICONS = [
  iconTaxi,
  iconSamoosa,
  iconGatsby,
  iconDums,
  iconPlasticChair,
  iconKlopseHeadgear,
  iconAthloneStadium,
];
const BAND_COUNT = 10;

// Toggled on the track element directly (no React state) while a scroll
// gesture is in flight, so the scrollbar only paints while it's useful.
const SCROLLING_CLASS = 'vol-events__track--scrolling';
const SCROLLBAR_HIDE_DELAY_MS = 650;

// Stands in for the event photo the real data will carry: the brand icon set
// tiled over purple, offset per card so no two bands look identical.
const EventBand = memo(function EventBand({ seed, online, locked = false }) {
  const icons = useMemo(
    () =>
      Array.from({ length: BAND_COUNT }, (_, i) => BAND_ICONS[(seed * 3 + i) % BAND_ICONS.length]),
    [seed],
  );

  return (
    <div className="vol-events__band">
      <div className="vol-events__band-grid" aria-hidden="true">
        {icons.map((src, i) => (
          <img key={i} src={src} alt="" width={40} height={40} loading="lazy" decoding="async" />
        ))}
      </div>
      {online && <p className="vol-events__tag">Online event</p>}
      {locked && (
        <div className="vol-events__lock" aria-hidden="true">
          <Icon name="lock-keyhole" size={28} />
        </div>
      )}
    </div>
  );
});

// A "locked level": the event is announced but can't be signed up for yet.
// Its band is drained of colour behind a padlock, and the button is
// disabled until the event gets a date (see volunteerEvents.js).
const LockedEventCard = memo(function LockedEventCard({ event, index }) {
  return (
    <li className="vol-events__item">
      <article className="vol-events__card vol-events__card--locked">
        <EventBand seed={index} locked />

        <div className="vol-events__body">
          <p className="vol-events__badge vol-events__badge--locked">
            <Icon name="lock" size={14} />
            Coming soon
          </p>
          <p className="vol-events__when">Date to be announced</p>
          <h3 className="vol-events__title">{event.title}</h3>
          <p className="vol-events__where">{event.location}</p>
        </div>

        <div className="vol-events__foot">
          <Button variant="primary" fullWidth disabled>
            <Icon name="lock" size={18} />
            Unlocking soon
          </Button>
        </div>
      </article>
    </li>
  );
});

const EventCard = memo(function EventCard({ event, index, onSelect }) {
  const handleClick = useCallback(() => onSelect(event), [event, onSelect]);

  return (
    <li className="vol-events__item">
      <article className="vol-events__card">
        <EventBand seed={index} online={event.online} />

        <div className="vol-events__body">
          <p className="vol-events__badge">{event.badge}</p>
          <p className="vol-events__when">
            <time dateTime={event.dateTime}>{event.when}</time>
          </p>
          <h3 className="vol-events__title">{event.title}</h3>
          <p className="vol-events__where">{event.location}</p>
        </div>

        <div className="vol-events__foot">
          <Button variant="primary" fullWidth onClick={handleClick}>
            More details
            {/* Every card's button reads "More details"; the title keeps them
                apart for anyone listing the page's buttons. */}
            <span className="sr-only"> for {event.title}</span>
            <Icon name="arrow-right" size={18} />
          </Button>
        </div>
      </article>
    </li>
  );
});

function VolunteerEvents() {
  const headingId = useId();
  const dialogTitleId = useId();
  const trackRef = useRef(null);
  // Worked out per mount rather than at import, so a tab left open
  // overnight still drops yesterday's events on the next visit.
  const events = useMemo(() => decorateEvents(VOLUNTEER_EVENTS), []);

  // Kept separately from `isOpen` so the dialog still has its event to render
  // on the frame where it closes, instead of flashing an empty panel.
  const [activeEvent, setActiveEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // Once signed up, the dialog shows only the thank-you message.
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [nav, setNav] = useState({ overflows: false, atStart: true, atEnd: false });

  const syncNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = {
      overflows: max > 1,
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= max - 1,
    };
    // Scrolling fires constantly; only re-render when a flag actually flips.
    setNav((prev) =>
      prev.overflows === next.overflows && prev.atStart === next.atStart && prev.atEnd === next.atEnd
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        syncNav();
      });
    };

    syncNav();
    el.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('scroll', schedule);
      observer.disconnect();
    };
  }, [syncNav]);

  // Scrollbar stays hidden at rest and appears only while actively
  // scrolling (a plain class toggle, debounced — no React re-render, since
  // this never affects layout or anything else on screen).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let hideTimer = 0;
    const onScroll = () => {
      el.classList.add(SCROLLING_CLASS);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => el.classList.remove(SCROLLING_CLASS), SCROLLBAR_HIDE_DELAY_MS);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(hideTimer);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollByCards = useCallback((direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: step * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, []);

  const scrollPrev = useCallback(() => scrollByCards(-1), [scrollByCards]);
  const scrollNext = useCallback(() => scrollByCards(1), [scrollByCards]);

  const openEvent = useCallback((event) => {
    setActiveEvent(event);
    setIsSignedUp(false);
    setIsOpen(true);
  }, []);
  const closeEvent = useCallback(() => setIsOpen(false), []);
  const markSignedUp = useCallback(() => setIsSignedUp(true), []);

  return (
    <section className="vol-events" aria-labelledby={headingId}>
      <div className="ds-container">
        <div className="vol-events__head">
          <div>
            <p className="ds-eyebrow">Knock on Doors</p>
            <h2 id={headingId} className="vol-events__heading">
              Volunteer for an event
            </h2>
            <p className="vol-events__lead">
              Join the Mustapha campaign in canvassing neighbours and persuading them to vote for
              Thaafir.
            </p>
          </div>

          {nav.overflows && (
            <div className="vol-events__nav">
              <IconButton
                icon="arrow-left"
                label="Show previous events"
                onClick={scrollPrev}
                disabled={nav.atStart}
              />
              <IconButton
                icon="arrow-right"
                label="Show more events"
                onClick={scrollNext}
                disabled={nav.atEnd}
              />
            </div>
          )}
        </div>

        {events.length === 0 && (
          <p className="vol-events__status" role="status">
            No upcoming events right now — check back soon.
          </p>
        )}

        {/* Always rendered (even when empty) so the scroll/resize listeners
            above always have a node to attach to. Edge fades only
            appear on a side that actually has more cards to reveal — gated
            on `overflows` too, so a list that fits the viewport never shows
            a fade with nothing behind it. */}
        <ul
          className="vol-events__track"
          ref={trackRef}
          data-fade-start={nav.overflows && !nav.atStart}
          data-fade-end={nav.overflows && !nav.atEnd}
        >
          {events.map((event, index) =>
            event.comingSoon ? (
              <LockedEventCard key={event.id} event={event} index={index} />
            ) : (
              <EventCard key={event.id} event={event} index={index} onSelect={openEvent} />
            ),
          )}
        </ul>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeEvent}
        titleId={dialogTitleId}
        title={activeEvent ? activeEvent.title : 'Volunteer'}
      >
        {/* Keyed on the open event so each visit starts from a blank form
            rather than the previous sign-up's state. */}
        <div key={`${activeEvent?.id}-${isOpen}`} className="vol-events__dialog">
          {activeEvent && !isSignedUp && (
            <>
              <p className="vol-events__dialog-meta">
                <time dateTime={activeEvent.dateTime}>{activeEvent.when}</time>
                <span aria-hidden="true"> · </span>
                {activeEvent.location}
              </p>
              <p className="modal__intro">{activeEvent.blurb}</p>
            </>
          )}
          <VolunteerForm event={activeEvent} onSuccess={markSignedUp} />
        </div>
      </Modal>
    </section>
  );
}

export default VolunteerEvents;
