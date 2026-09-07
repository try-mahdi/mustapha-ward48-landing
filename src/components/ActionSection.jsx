import ElectionCountdown from './ElectionCountdown.jsx';
import GetInvolved from './GetInvolved.jsx';
import './ActionSection.css';

function ActionSection({ onDonateClick, onContactClick }) {
  return (
    <div className="action-section">
      <ElectionCountdown />
      <GetInvolved onDonateClick={onDonateClick} onContactClick={onContactClick} />
    </div>
  );
}

export default ActionSection;
