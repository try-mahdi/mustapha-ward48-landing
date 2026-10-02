import { useId, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Input from './Input.jsx';
import IconPattern from './IconPattern.jsx';
import { WARD48_SUBURBS } from '../data/ward48-suburbs.js';
import './VolunteerPage.css';

// For now sign-ups go through the contact form's existing EmailJS template
// (same service, key and inbox), so nothing new needs setting up: the
// volunteer details are mapped onto that template's fields, with the extra
// answers written into its message. A dedicated volunteer template and an
// automated thank-you/WhatsApp email can come later.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const IS_CONFIGURED = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

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
    }
  };

  if (status === 'success') {
    return (
      <div className="volunteer__success" role="status">
        <h2 className="volunteer__success-title">Thank you{firstName && `, ${firstName}`}!</h2>
        <p>Someone from our team will contact you for more information.</p>
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
