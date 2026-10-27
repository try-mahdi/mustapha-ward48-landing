import IconPattern from './IconPattern.jsx';
import VolunteerForm from './VolunteerForm.jsx';
import VolunteerEvents from './VolunteerEvents.jsx';
import './VolunteerPage.css';

function VolunteerPage() {
  return (
    <>
      {/* Same treatment as the homepage hero: a short, muted, looping clip
          (0:13–0:26 of the volunteer video, cut to keep it light). */}
      <section className="volunteer-hero" aria-labelledby="volunteer-heading">
        <video
          className="volunteer-hero__video"
          src="/video/volunteer-bg.mp4"
          poster="/video/volunteer-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="volunteer-hero__scrim" aria-hidden="true" />
        <div className="volunteer-hero__content">
          <p className="ds-eyebrow volunteer-hero__eyebrow">Take action</p>
          <h1 id="volunteer-heading" className="volunteer__title">
            Volunteer
          </h1>
          <p className="volunteer__intro">
            Want to help put Athlone first? Leave your details below and someone from our team
            will be in touch.
          </p>
        </div>
      </section>

      <VolunteerEvents />

      <section className="volunteer" aria-label="Volunteer sign-up form">
        <IconPattern />
        <div className="volunteer__inner">
          <div className="volunteer__card">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default VolunteerPage;
