import { useId, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Modal from './Modal.jsx';
import Input from './Input.jsx';
import './ContactDialog.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const IS_CONFIGURED = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

function ContactForm({ onClose }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!IS_CONFIGURED) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-dialog__status" role="status">
        <p className="modal__intro">Thanks — the campaign will be in touch ASAP.</p>
        <button type="button" className="modal__submit" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-dialog__form" onSubmit={handleSubmit}>
      <p className="modal__intro">Leave your details and the campaign will get back to you.</p>

      <div className="contact-dialog__grid">
        <Input label="Name" name="firstName" type="text" autoComplete="given-name" required />
        <Input label="Last name" name="lastName" type="text" autoComplete="family-name" required />
      </div>

      <Input
        label="Cell number"
        name="cell"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
      />

      <Input label="Email address" name="email" type="email" autoComplete="email" required />

      <Input label="Message" name="message" multiline rows={4} />

      {status === 'error' && (
        <p className="contact-dialog__error" role="alert">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <button type="submit" className="modal__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

function ContactDialog({ isOpen, onClose }) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId} title="Contact us">
      <ContactForm key={isOpen} onClose={onClose} />
    </Modal>
  );
}

export default ContactDialog;
