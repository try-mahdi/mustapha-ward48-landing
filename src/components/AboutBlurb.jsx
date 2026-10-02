import { Link } from 'react-router-dom';
import IconPattern from './IconPattern.jsx';
import './AboutBlurb.css';

// The campaign video, as a standard YouTube embed with YouTube's own
// thumbnail (privacy-enhanced youtube-nocookie domain).
const VIDEO_ID = 'BO0FkmMRFYU';
const VIDEO_TITLE = 'It Belongs to Us | Thaafir Mustapha for Ward Councillor';

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
          <iframe
            className="about-blurb__video"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&playsinline=1`}
            title={VIDEO_TITLE}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default AboutBlurb;
