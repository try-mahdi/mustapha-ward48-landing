import bioPhoto from '../assets/about-headshot.jpg';
import IconPattern from './IconPattern.jsx';
import './MeetThaafir.css';

// TODO: swap in Thaafir's real facts, timeline milestones and quote once
// they're finalised — everything below is placeholder copy mirroring the
// approved design mock.
const FACTS = [
  { label: 'Age', value: '28' },
  { label: 'Ward', value: '48' },
  { label: 'Family', value: 'Lorem' },
  { label: 'Work', value: 'Lorem' },
];

const TIMELINE = [
  {
    number: '98',
    head: 'Lorem ipsum',
    detail: 'Consectetur adipiscing elit sed do eiusmod',
  },
  {
    number: '16',
    head: 'Vivamus lacinia',
    detail: 'Odio vitae vestibulum vestibulum cras',
  },
  {
    number: '20',
    head: 'Cras vehicula',
    detail: 'Mi eget laoreet venenatis sem velit',
  },
  {
    number: '26',
    head: 'Running for Ward 48',
    detail: 'This is where it starts',
    highlight: true,
  },
];

function MeetThaafir() {
  return (
    <>
      <section className="meet-thaafir__hero" aria-labelledby="meet-thaafir-heading">
        <IconPattern />

        <div className="meet-thaafir__hero-head">
          <p className="ds-eyebrow meet-thaafir__eyebrow">Your candidate for Ward 48</p>
          <h1 id="meet-thaafir-heading" className="meet-thaafir__title">
            MEET <span className="meet-thaafir__title-accent">THAAFIR</span>
            <span className="meet-thaafir__dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </h1>
        </div>

        <div className="meet-thaafir__intro">
          <div className="meet-thaafir__photo">
            <img src={bioPhoto} alt="Thaafir" />
          </div>
          <div className="meet-thaafir__bio">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio
              vitae vestibulum vestibulum. Cras vehicula, mi eget laoreet venenatis, sem velit
              cursus arcu, a gravida nisi sapien eu massa.
            </p>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae
              elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.
            </p>
            <p>
              Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed
              consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
              auctor. Maecenas sed diam eget risus varius blandit sit amet non magna.
            </p>
          </div>
        </div>
      </section>

      <section className="meet-thaafir__facts" aria-label="Quick facts">
        <div className="meet-thaafir__facts-grid">
          {FACTS.map((fact) => (
            <div key={fact.label} className="meet-thaafir__fact">
              <span className="meet-thaafir__fact-label">{fact.label}</span>
              <span className="meet-thaafir__fact-value">{fact.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="meet-thaafir__road" aria-labelledby="meet-thaafir-road-heading">
        <p id="meet-thaafir-road-heading" className="ds-eyebrow">
          The road here
        </p>
        <div className="meet-thaafir__timeline">
          {TIMELINE.map((item) => (
            <div
              key={item.head}
              className={`meet-thaafir__milestone ${item.highlight ? 'is-highlight' : ''}`}
            >
              <span className="meet-thaafir__milestone-number">{item.number}</span>
              <div className="meet-thaafir__milestone-text">
                <h3>{item.head}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="meet-thaafir__quote">
        <blockquote>
          &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit.&rdquo;
        </blockquote>
        <p className="meet-thaafir__quote-attr">— Thaafir</p>
      </section>
    </>
  );
}

export default MeetThaafir;
