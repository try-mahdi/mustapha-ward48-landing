import IconButton from './IconButton.jsx';
import './DonationStatusBanner.css';

const COPY = {
  success: 'Thank you for your donation — your support means a lot to the campaign.',
  cancelled: 'Your donation was cancelled. No payment was taken.',
  failed: "Your donation didn't go through. Please try again, or get in touch if it keeps happening.",
};

function DonationStatusBanner({ status, onDismiss }) {
  const message = COPY[status];
  if (!message) return null;

  return (
    <div className={`donation-banner donation-banner--${status}`} role="status">
      <p className="donation-banner__text">{message}</p>
      <IconButton icon="x" label="Dismiss" variant="ghost" size={32} onClick={onDismiss} />
    </div>
  );
}

export default DonationStatusBanner;
