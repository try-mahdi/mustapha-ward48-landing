import logoPrimary from '../assets/logo-primary.svg';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-label="Mustapha for Ward 48">
      <video
        className="hero__video"
        src="/video/hero-bg.mp4"
        poster="/video/hero-bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__content">
        <img
          src={logoPrimary}
          alt="Mustapha for Ward 48"
          className="hero__logo"
          width={400}
          height={236}
        />
      </div>
    </section>
  );
}

export default Hero;
