import { useState } from 'react';
import { Link } from 'react-router-dom';
import aboutHeadshot from '../assets/about-headshot.jpg';
import IconPattern from './IconPattern.jsx';
import './AboutBlurb.css';

// The campaign video. Only the photo and play button render until someone
// presses play, so YouTube's player (and its cookies — this is the
// privacy-enhanced youtube-nocookie domain) never load for visitors who don't.
const VIDEO_ID = 'BO0FkmMRFYU';
const VIDEO_TITLE = 'It Belongs to Us | Thaafir Mustapha for Ward Councillor';

function AboutBlurb() {
  const [playing, setPlaying] = useState(false);

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

        <div className={`about-blurb__media ${playing ? 'is-playing' : ''}`}>
          {playing ? (
            <iframe
              className="about-blurb__video"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={aboutHeadshot}
                alt="Mustapha smiling"
                className="about-blurb__media-image"
              />
              <button
                type="button"
                className="about-blurb__play"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${VIDEO_TITLE}`}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--purple)" aria-hidden="true">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutBlurb;
