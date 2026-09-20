import { Link } from 'react-router-dom';
import aboutHeadshot from '../assets/about-headshot.jpg';
import IconPattern from './IconPattern.jsx';
import './AboutBlurb.css';

function AboutBlurb() {
  return (
    <section className="about-blurb" id="about" aria-labelledby="about-heading">
      <IconPattern />

      <div className="about-blurb__grid">
        <div>
          <p className="ds-eyebrow">We're fighting for</p>
          <h2 id="about-heading" className="about-blurb__title">
            SAFER STREETS,<br/>
            STRONGER COMMUNITY,<br/>
            ATHLONE FIRST
          </h2>
          <p className="about-blurb__body">
            Ward 48 stretches from Athlone CBD to Belgravia. From Kilpfontein to Pinati Estate. This area is tells the story of a rich cultural history. It’s our duty to make it better to live in!
          </p>
          <Link to="/meet-thaafir" className="about-blurb__link">
            Read on
          </Link>
        </div>

        <div className="about-blurb__media">
          <img
            src={aboutHeadshot}
            alt="Mustapha smiling"
            className="about-blurb__media-image"
          />
          <div className="about-blurb__play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--purple)">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutBlurb;
