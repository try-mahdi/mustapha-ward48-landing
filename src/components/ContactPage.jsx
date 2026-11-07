import IconPattern from './IconPattern.jsx';
import { ContactForm } from './ContactDialog.jsx';
import './ContactPage.css';

// Replaced the volunteer page after the election; /volunteer redirects here.
function ContactPage() {
  return (
    <>
      {/* Same treatment as the homepage hero: a short, muted, looping clip. */}
      <section className="contact-hero" aria-labelledby="contact-heading">
        <video
          className="contact-hero__video"
          src="/video/volunteer-bg.mp4"
          poster="/video/volunteer-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="contact-hero__scrim" aria-hidden="true" />
        <div className="contact-hero__content">
          <h1 id="contact-heading" className="contact-page__title">
            Keep the Conversation Going
          </h1>
        </div>
      </section>

      <section className="contact-page" aria-label="Contact form">
        <IconPattern />
        <div className="contact-page__inner">
          <div className="contact-page__card">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
