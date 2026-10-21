import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Input from './Input.jsx';
import Button from './Button.jsx';
import './VolunteerForm.css';

// Event sign-ups are saved to the campaign's Google Sheet by an Apps Script
// web app (google-apps-script/volunteer-signups.gs), which also emails the
// team a "new volunteer" heads-up. Volunteer-page sign-ups — and event ones
// until the script's URL is set — go through the contact form's EmailJS
// template (same service, key and inbox), answers written into its message.
const SHEET_URL = import.meta.env.VITE_VOLUNTEER_SHEET_URL;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const HAS_EMAILJS = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

// The volunteers' WhatsApp group, shown after signing up.
const WHATSAPP_URL = 'https://chat.whatsapp.com/CjHLUxxrkvB4RaSNwXDqHt';

// EmailJS template for the thank-you email to volunteers who give an email
// address (it uses {{to_name}} and is sent to {{to_email}}). Template IDs
// aren't secret, so it lives here ("Volunteer Welcome" in the dashboard).
const WELCOME_TEMPLATE_ID = 'template_xfy3sbv';

const AVAILABILITY = ['Weekdays', 'Weekends', 'Both'];
const FREQUENCY = ['Once-off', 'Occasionally', 'Regularly', 'As much as needed'];

// text/plain keeps this a "simple" cross-origin request: Apps Script can't
// answer a CORS preflight, which a JSON content type would trigger.
async function saveEventSignUp(data, event) {
  const response = await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      availability: data.availability,
      frequency: data.frequency,
      event: `${event.title} (${event.when})`,
      website: data.hp_extra,
    }),
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`Sign-up rejected: ${result.error}`);
}

function sendViaEmailJS(data, event) {
  const params = {
    firstName: data.firstName,
    lastName: data.lastName,
    cell: data.phone,
    email: data.email,
    message: [
      event ? `VOLUNTEER SIGN-UP — ${event.title} (${event.when})` : 'VOLUNTEER SIGN-UP',
      `Name: ${data.firstName} ${data.lastName}`,
      `WhatsApp / mobile: ${data.phone}`,
      `Email: ${data.email || '(not given)'}`,
      `Usually available: ${data.availability}`,
      `How often: ${data.frequency}`,
      !event && `Open to a leadership position: ${data.leadership ? 'Yes' : 'No'}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
}

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

// Shared by the volunteer page and the event sign-up dialog, so both collect
// the same details. Given an `event`, it's the event version: the sign-up
// goes to the sheet tagged with that event, the leadership question is left
// out and a note says training will be provided. `onSuccess` lets the
// surrounding dialog tidy itself up around the thank-you message.
function VolunteerForm({ event = null, onSuccess }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [firstName, setFirstName] = useState('');

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const useSheet = Boolean(event && SHEET_URL);
    if (!useSheet && !HAS_EMAILJS) {
      setStatus('error');
      return;
    }

    const data = Object.fromEntries(new FormData(formRef.current));

    setStatus('sending');
    try {
      if (useSheet) {
        await saveEventSignUp(data, event);
      } else if (!data.hp_extra) {
        // The sheet script checks the honeypot itself; EmailJS can't, so a
        // bot's sign-up is dropped here — while still "succeeding" for it.
        await sendViaEmailJS(data, event);
      }
      setFirstName(data.firstName.trim());
      setStatus('success');
      onSuccess?.();
    } catch {
      setStatus('error');
      return;
    }

    // The thank-you email is a nice-to-have: the sign-up has already reached
    // the campaign, so a failure here mustn't turn success into an error.
    if (HAS_EMAILJS && WELCOME_TEMPLATE_ID && data.email && !data.hp_extra) {
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
        <p>While you're at it, join our WhatsApp group:</p>
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

      {/* Honeypot: bots that fill in every field fill this too, and the
          sign-up is dropped. `hidden` (display: none) rather than moved
          off-screen, because browsers autofill off-screen fields — which
          silently dropped real sign-ups — but never non-rendered ones. The
          name is one no autofill profile maps to, for the same reason. */}
      <div hidden>
        <label>
          Leave this empty
          <input type="text" name="hp_extra" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <RadioGroup
        legend="When are you usually available?"
        name="availability"
        options={AVAILABILITY}
      />
      <RadioGroup legend="How often can you volunteer?" name="frequency" options={FREQUENCY} />

      {event ? (
        <p className="volunteer__training">
          No experience needed &mdash; training will be provided.
        </p>
      ) : (
        <label className="volunteer__checkbox">
          <input type="checkbox" name="leadership" value="Yes" />
          <span className="volunteer__checkbox-box" aria-hidden="true" />
          <span>I&rsquo;d be open to taking on a leadership position</span>
        </label>
      )}

      {status === 'error' && (
        <p className="volunteer__error" role="alert">
          Something went wrong sending your details. Please try again.
        </p>
      )}

      <button type="submit" className="modal__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Sign me up'}
      </button>

      <p className="volunteer__privacy">
        We&rsquo;ll only use your details to contact you about volunteering for the campaign.
      </p>
    </form>
  );
}

export default VolunteerForm;
