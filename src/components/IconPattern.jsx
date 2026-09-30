import { useMemo } from 'react';
import iconAthloneStadium from '../assets/icons/athlone-stadium.svg';
import iconDums from '../assets/icons/dums.svg';
import iconTaxi from '../assets/icons/taxi.svg';
import iconSamoosa from '../assets/icons/samoosa.svg';
import iconPlasticChair from '../assets/icons/plastic-chair.svg';
import iconKlopseHeadgear from '../assets/icons/klopse-headgear.svg';
import iconGatsby from '../assets/icons/gatsby.svg';
import iconAthloneStadiumOnPurple from '../assets/icons/athlone-stadium-on-purple.svg';
import iconDumsOnPurple from '../assets/icons/dums-on-purple.svg';
import iconTaxiOnPurple from '../assets/icons/taxi-on-purple.svg';
import iconSamoosaOnPurple from '../assets/icons/samoosa-on-purple.svg';
import iconPlasticChairOnPurple from '../assets/icons/plastic-chair-on-purple.svg';
import iconKlopseHeadgearOnPurple from '../assets/icons/klopse-headgear-on-purple.svg';
import iconGatsbyOnPurple from '../assets/icons/gatsby-on-purple.svg';
import { useIsMobile } from '../hooks/useIsMobile.js';
import './IconPattern.css';

const PATTERN_ICONS = {
  'athlone-stadium': iconAthloneStadium,
  dums: iconDums,
  taxi: iconTaxi,
  samoosa: iconSamoosa,
  'plastic-chair': iconPlasticChair,
  'klopse-headgear': iconKlopseHeadgear,
  gatsby: iconGatsby,
};
const PATTERN_ICONS_ON_PURPLE = {
  'athlone-stadium': iconAthloneStadiumOnPurple,
  dums: iconDumsOnPurple,
  taxi: iconTaxiOnPurple,
  samoosa: iconSamoosaOnPurple,
  'plastic-chair': iconPlasticChairOnPurple,
  'klopse-headgear': iconKlopseHeadgearOnPurple,
  gatsby: iconGatsbyOnPurple,
};
const PATTERN_SLUGS = Object.keys(PATTERN_ICONS);
const PATTERN_ROTATIONS = [-25, -15, -10, 0, 10, 15, 25, 45, -45, 30, -30, 5, -5, 20, -20];
const PATTERN_SEED = 42;

function patternRng(i) {
  return ((i * 1103515245 + PATTERN_SEED) >>> 16) % 360;
}

function buildIconPattern(isMobile) {
  const cols = isMobile ? 5 : 9;
  const rows = isMobile ? 6 : 5;
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      items.push({
        key: idx,
        slug: PATTERN_SLUGS[(idx + patternRng(idx)) % PATTERN_SLUGS.length],
        rotation: PATTERN_ROTATIONS[patternRng(idx * 7) % PATTERN_ROTATIONS.length],
        offsetX: (patternRng(idx * 3) % 20) - 10,
        offsetY: (patternRng(idx * 5) % 20) - 10,
      });
    }
  }
  return { cols, items };
}

function IconPattern({ onPurple = false, className = '' }) {
  const isMobile = useIsMobile();
  const { cols, items } = useMemo(() => buildIconPattern(isMobile), [isMobile]);
  const icons = onPurple ? PATTERN_ICONS_ON_PURPLE : PATTERN_ICONS;

  return (
    <div
      className={`icon-pattern ${className}`.trim()}
      aria-hidden="true"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {items.map((item) => (
        <img
          key={item.key}
          src={icons[item.slug]}
          alt=""
          className="icon-pattern__icon"
          style={{ transform: `rotate(${item.rotation}deg) translate(${item.offsetX}px, ${item.offsetY}px)` }}
        />
      ))}
    </div>
  );
}

export default IconPattern;
