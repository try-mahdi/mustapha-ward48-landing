import logoPrimary from '../assets/logo-primary.svg';
import './Hero.css';

function Hero({ ref }) {
  return (
    <section ref={ref} className="hero" aria-label="Mustapha for Ward 48">
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__content">
        <img
          src={logoPrimary}
          alt="Mustapha for Ward 48"
          className="hero__logo"
          width={280}
          height={196}
        />
      </div>
      <p className="hero__caption">Auto-playing video background placeholder</p>
    </section>
  );
}

export default Hero;
