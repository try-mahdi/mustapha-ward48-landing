import { memo } from 'react';
import athloneStadium from '../assets/icons/athlone-stadium-on-gold.svg';
import dums from '../assets/icons/dums-on-gold.svg';
import taxi from '../assets/icons/taxi-on-gold.svg';
import samoosa from '../assets/icons/samoosa-on-gold.svg';
import plasticChair from '../assets/icons/plastic-chair-on-gold.svg';
import klopseHeadgear from '../assets/icons/klopse-headgear-on-gold.svg';
import gatsby from '../assets/icons/gatsby-on-gold.svg';
import './PatternBand.css';

const ICON_SET = [athloneStadium, dums, taxi, samoosa, plasticChair, klopseHeadgear, gatsby];
// Four copies back-to-back so the CSS animation can loop seamlessly at -25%.
const BAND_ICONS = [...ICON_SET, ...ICON_SET, ...ICON_SET, ...ICON_SET];

function PatternBand() {
  return (
    <div className="pattern-band" aria-hidden="true">
      <div className="pattern-band__track">
        {BAND_ICONS.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            className="pattern-band__icon"
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}

export default memo(PatternBand);
