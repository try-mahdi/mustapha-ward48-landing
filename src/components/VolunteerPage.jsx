import { useId, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Input from './Input.jsx';
import Button from './Button.jsx';
import IconPattern from './IconPattern.jsx';
import { WARD48_SUBURBS } from '../data/ward48-suburbs.js';
import './VolunteerPage.css';

// Sign-ups go through the contact form's existing EmailJS template (same
// service, key and inbox): the volunteer details are mapped onto that
// template's fields, with the extra answers written into its message.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const IS_CONFIGURED = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

// The volunteers' WhatsApp group, shown after signing up.
const WHATSAPP_URL = 'https://chat.whatsapp.com/CjHLUxxrkvB4RaSNwXDqHt';

// EmailJS template for the thank-you email to volunteers who give an email
// address (it uses {{to_name}} and is sent to {{to_email}}). Template IDs
// aren't secret, so it lives here; while it's empty no thank-you is sent.
const WELCOME_TEMPLATE_ID = '';

const AVAILABILITY = ['Weekdays', 'Weekends', 'Both'];
const FREQUENCY = ['Once-off', 'Occasionally', 'Regularly', 'As much as needed'];

function RadioGroup({ legend, name, options }) {
  return (
    <fieldset className="volunteer__radios">
      <legend className="field__label">
        {legend}
        <span className="field__required" aria-hidden="true">
          {' '}
          *
        </span>
      </legend>
      <div className="volunteer__radio-options">
        {options.map((option, i) => (
          <label key={option} className="volunteer__radio">
            <input type="radio" name={name} value={option} required={i === 0} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function VolunteerForm() {
  const formRef = useRef(null);
  const suburbListId = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [firstName, setFirstName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!IS_CONFIGURED) {
      setStatus('error');
      return;
    }

    const data = Object.fromEntries(new FormData(formRef.current));
    const params = {
      firstName: data.firstName,
      lastName: data.lastName,
      cell: data.phone,
      email: data.email,
      message: [
        'VOLUNTEER SIGN-UP',
        `Name: ${data.firstName} ${data.lastName}`,
        `WhatsApp / mobile: ${data.phone}`,
        `Email: ${data.email || '(not given)'}`,
        `Area / neighbourhood: ${data.area}`,
        `Usually available: ${data.availability}`,
        `How often: ${data.frequency}`,
      ].join('\n'),
    };

    setStatus('sending');
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
      setFirstName(data.firstName.trim());
      setStatus('success');
    } catch {
      setStatus('error');
      return;
    }

    // The thank-you email is a nice-to-have: the sign-up has already reached
    // the campaign, so a failure here mustn't turn success into an error.
    if (WELCOME_TEMPLATE_ID && data.email) {
      emailjs
        .send(
          SERVICE_ID,
          WELCOME_TEMPLATE_ID,
          { to_name: data.firstName.trim(), to_email: data.email },
          { publicKey: PUBLIC_KEY },
        )
        .catch(() => {});
    }
  };

  if (status === 'success') {
    return (
      <div className="volunteer__success" role="status">
        <h2 className="volunteer__success-title">Thank you{firstName && `, ${firstName}`}!</h2>
        <p>
          Thank you so much for being willing to help us out on the campaign. Someone from our
          team will contact you for more information.
        </p>
        <p>Join our WhatsApp group so we can get started:</p>
        <Button variant="accent" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          Join our WhatsApp group
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="volunteer__form" onSubmit={handleSubmit}>
      <div className="volunteer__name-row">
        <Input label="Name" name="firstName" type="text" autoComplete="given-name" required />
        <Input label="Surname" name="lastName" type="text" autoComplete="family-name" required />
      </div>
      <Input
        label="WhatsApp / mobile number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        hint="Optional"
      />
      <Input
        label="Area / neighbourhood"
        name="area"
        type="text"
        list={suburbListId}
        autoComplete="off"
        required
      />
      <datalist id={suburbListId}>
        {WARD48_SUBURBS.map((suburb) => (
          <option key={suburb} value={suburb} />
        ))}
      </datalist>

      <RadioGroup
        legend="When are you usually available?"
        name="availability"
        options={AVAILABILITY}
      />
      <RadioGroup legend="How often can you volunteer?" name="frequency" options={FREQUENCY} />

      {status === 'error' && (
        <p className="volunteer__error" role="alert">
          Something went wrong sending your details. Please try again.
        </p>
      )}

      <button type="submit" className="modal__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Sign me up'}
      </button>
    </form>
  );
}

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
