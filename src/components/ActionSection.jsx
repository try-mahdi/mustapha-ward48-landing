import ElectionCountdown from './ElectionCountdown.jsx';
import GetInvolved from './GetInvolved.jsx';
import './ActionSection.css';

function ActionSection({ onDonateClick }) {
  return (
    <div className="action-section">
      <ElectionCountdown />
      <GetInvolved onDonateClick={onDonateClick} />
    </div>
  );
}

export default ActionSection;
