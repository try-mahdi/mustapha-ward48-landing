import { useId, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Input from './Input.jsx';
import Button from './Button.jsx';
import IconPattern from './IconPattern.jsx';
import { WARD48_SUBURBS } from '../data/ward48-suburbs.js';
import './VolunteerPage.css';

// Same EmailJS account as the contact form, with two extra templates:
// - VOLUNTEER_TEMPLATE_ID emails the campaign each new sign-up.
// - WELCOME_TEMPLATE_ID (optional) emails the volunteer a thank-you with the
//   WhatsApp link, when they gave an email address.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const VOLUNTEER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_VOLUNTEER_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_VOLUNTEER_WELCOME_TEMPLATE_ID;
const IS_CONFIGURED = Boolean(SERVICE_ID && PUBLIC_KEY && VOLUNTEER_TEMPLATE_ID);

// The volunteers' WhatsApp group/community invite link. Shown after signing
// up and put in the welcome email; leave empty to hide the button.
const WHATSAPP_URL = import.meta.env.VITE_VOLUNTEER_WHATSAPP_URL || '';

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

    const form = formRef.current;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, VOLUNTEER_TEMPLATE_ID, form, { publicKey: PUBLIC_KEY });
      setFirstName(String(data.fullName).trim().split(/\s+/)[0]);
      setStatus('success');
    } catch {
      setStatus('error');
      return;
    }

    // The thank-you email is a nice-to-have: the sign-up has already reached
    // the campaign, so a failure here shouldn't turn success into an error.
    if (WELCOME_TEMPLATE_ID && data.email) {
      emailjs
        .send(
          SERVICE_ID,
          WELCOME_TEMPLATE_ID,
          { to_name: data.fullName, to_email: data.email, whatsapp_url: WHATSAPP_URL },
          { publicKey: PUBLIC_KEY },
        )
        .catch(() => {});
    }
  };

  if (status === 'success') {
    return (
      <div className="volunteer__success" role="status">
        <h2 className="volunteer__success-title">Thank you{firstName && `, ${firstName}`}!</h2>
        <p>Someone from our team will contact you for more information.</p>
        {WHATSAPP_URL && (
          <>
            <p>In the meantime, join the volunteers&rsquo; WhatsApp group:</p>
            <Button variant="accent" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Join us on WhatsApp
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} className="volunteer__form" onSubmit={handleSubmit}>
      <Input label="Full name" name="fullName" type="text" autoComplete="name" required />
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
        hint="Optional — we'll email you the WhatsApp link."
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
    <section className="volunteer" aria-labelledby="volunteer-heading">
      <IconPattern />
      <div className="volunteer__inner">
        <p className="ds-eyebrow">Take action</p>
        <h1 id="volunteer-heading" className="volunteer__title">
          Volunteer
        </h1>
        <p className="volunteer__intro">
          Want to help put Athlone first? Leave your details below and someone from our team
          will be in touch.
        </p>

        <div className="volunteer__card">
          <VolunteerForm />
        </div>
      </div>
    </section>
  );
}

export default VolunteerPage;
