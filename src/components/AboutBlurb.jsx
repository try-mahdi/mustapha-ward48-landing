import './AboutBlurb.css';

function AboutBlurb() {
  return (
    <section className="about-blurb" id="about" aria-labelledby="about-heading">
      <div className="about-blurb__grid">
        <div>
          <p className="ds-eyebrow">About the campaign</p>
          <h2 id="about-heading" className="about-blurb__title">
            It shouldn&rsquo;t be this hard just to get by
          </h2>
          <p className="about-blurb__body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
          <a href="#record" className="about-blurb__link">
            Read on
          </a>
        </div>

        <div className="about-blurb__media" role="img" aria-label="Video or photo placeholder">
          <div className="about-blurb__play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--purple)">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
          <span className="about-blurb__media-caption">Video / photo placeholder</span>
        </div>
      </div>
    </section>
  );
}

export default AboutBlurb;
