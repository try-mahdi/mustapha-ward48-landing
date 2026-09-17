import { useEffect, useMemo, useRef, useState } from 'react';
import iconAthloneStadium from '../assets/icons/athlone-stadium.svg';
import iconPlasticChair from '../assets/icons/plastic-chair.svg';
import iconKlopseHeadgear from '../assets/icons/klopse-headgear.svg';
import iconAthloneStadiumOnPurple from '../assets/icons/athlone-stadium-on-purple.svg';
import iconDumsOnPurple from '../assets/icons/dums-on-purple.svg';
import iconTaxiOnPurple from '../assets/icons/taxi-on-purple.svg';
import iconSamoosaOnPurple from '../assets/icons/samoosa-on-purple.svg';
import iconPlasticChairOnPurple from '../assets/icons/plastic-chair-on-purple.svg';
import iconKlopseHeadgearOnPurple from '../assets/icons/klopse-headgear-on-purple.svg';
import iconGatsbyOnPurple from '../assets/icons/gatsby-on-purple.svg';
import Button from './Button.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import './ThePlan.css';

const PATTERN_ICONS_ON_PURPLE = [
  iconAthloneStadiumOnPurple,
  iconDumsOnPurple,
  iconTaxiOnPurple,
  iconSamoosaOnPurple,
  iconPlasticChairOnPurple,
  iconKlopseHeadgearOnPurple,
  iconGatsbyOnPurple,
];
const PATTERN_SEED = 77;

function patternRng(i) {
  return ((i * 1103515245 + PATTERN_SEED) >>> 16) % 360;
}

function buildHeroPattern(isMobile) {
  const cols = isMobile ? 6 : 12;
  const rows = isMobile ? 3 : 2;
  const rotations = [-20, -10, 0, 10, 20, 35, -35, 15, -15];
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      items.push({
        key: idx,
        src: PATTERN_ICONS_ON_PURPLE[(idx + patternRng(idx)) % PATTERN_ICONS_ON_PURPLE.length],
        rotation: rotations[patternRng(idx * 7) % rotations.length],
      });
    }
  }
  return { cols, items };
}

const THEMES = [
  {
    name: 'Safer Streets',
    icon: iconKlopseHeadgear,
    iconOpen: iconKlopseHeadgearOnPurple,
    points: [
      { head: 'CCTV', detail: 'More camera coverage across the ward.' },
      { head: 'Visible policing', detail: 'A stronger, visible police presence.' },
      {
        head: 'Holding SAPS accountable',
        detail: 'Pushing the South African Police Service to deliver for the ward.',
      },
      {
        head: 'Rebuilding homeless shelters',
        detail: 'Getting people off the streets and into the help they need.',
      },
      {
        head: 'Starving the gangs of manpower',
        detail: "Reinvesting in the poorest Capetonians so gangs can't recruit.",
      },
    ],
  },
  {
    name: 'Stronger Communities',
    icon: iconPlasticChair,
    iconOpen: iconPlasticChairOnPurple,
    points: [
      {
        head: 'Youth programmes',
        detail: 'Structured activities and mentorship for young people in the ward.',
      },
      {
        head: 'Community programmes',
        detail: 'Support networks that bring neighbours together.',
      },
      { head: 'Regular town halls', detail: 'Weekly or bi-weekly, open to all residents.' },
    ],
  },
  {
    name: 'Athlone First',
    icon: iconAthloneStadium,
    iconOpen: iconAthloneStadiumOnPurple,
    points: [
      {
        head: 'Bringing city money back to the ward',
        detail: 'Fixing long-neglected basics like clogged drains.',
      },
    ],
  },
];

function ThemeAccordion({ theme, isOpen, isMobile, onToggle, itemRef }) {
  const pointCount = theme.points.length;

  return (
    <div className="the-plan__theme" ref={itemRef}>
      <button
        type="button"
        className={`the-plan__theme-header ${isOpen ? 'is-open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="the-plan__theme-icon">
          <img src={isOpen ? theme.iconOpen : theme.icon} alt="" />
        </span>
        <span className="the-plan__theme-heading">
          <span className="the-plan__theme-name">{theme.name}</span>
          <span className="the-plan__theme-count">
            {pointCount} {pointCount === 1 ? 'commitment' : 'commitments'}
          </span>
        </span>
        <span className="the-plan__theme-toggle" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="the-plan__theme-panel">
          <div
            className="the-plan__points"
            style={{
              gridTemplateColumns: isMobile
                ? '1fr'
                : pointCount <= 2
                  ? `repeat(${pointCount}, 1fr)`
                  : 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {theme.points.map((point, i) => (
              <div key={point.head} className="the-plan__point">
                <div className="the-plan__point-head">
                  <span className="the-plan__point-number">{i + 1}</span>
                  <h3>{point.head}</h3>
                </div>
                <p>{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThePlan({ onContactClick }) {
  const isMobile = useIsMobile();
  const [openTheme, setOpenTheme] = useState(null);
  const { cols, items } = useMemo(() => buildHeroPattern(isMobile), [isMobile]);
  const themeRefs = useRef([]);

  useEffect(() => {
    if (openTheme === null) return;
    const el = themeRefs.current[openTheme];
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [openTheme]);

  return (
    <>
      <section className="the-plan__hero" aria-labelledby="the-plan-heading">
        <div
          className="the-plan__hero-pattern"
          aria-hidden="true"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item) => (
            <img
              key={item.key}
              src={item.src}
              alt=""
              style={{ transform: `rotate(${item.rotation}deg)` }}
            />
          ))}
        </div>
        <div className="the-plan__hero-content">
          <p className="ds-eyebrow">—</p>
          <h1 id="the-plan-heading" className="the-plan__hero-title">
            The Plan
          </h1>
          <p className="the-plan__hero-body">
            The things that matter
          </p>
        </div>
      </section>

      <div className="the-plan__themes">
        {THEMES.map((theme, i) => (
          <ThemeAccordion
            key={theme.name}
            theme={theme}
            isMobile={isMobile}
            isOpen={openTheme === i}
            onToggle={() => setOpenTheme((current) => (current === i ? null : i))}
            itemRef={(el) => {
              themeRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <section className="the-plan__cta">
        <h2>That&rsquo;s the plan</h2>
        <p>Hold me to it. Tap below to chat to us about anything on this list.</p>
        <div className="the-plan__cta-actions">
          <Button variant="primary" onClick={onContactClick}>
            Chat to us
          </Button>
        </div>
      </section>
    </>
  );
}

export default ThePlan;
