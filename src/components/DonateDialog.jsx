import { useState, useId } from 'react';
import Modal from './Modal.jsx';
import './DonateDialog.css';

const PRESET_AMOUNTS = [
  { amount: 20, link: 'https://pay.yoco.com/r/yEEXnG' },
  { amount: 50, link: 'https://pay.yoco.com/r/wDDdnk' },
  { amount: 100, link: 'https://pay.yoco.com/r/b55PKO' },
];

function DonateForm({ onClose }) {
  const [amount, setAmount] = useState(null);

  const donateLabel = amount ? `Donate R${amount}` : 'Select an amount';
  const donateDisabled = !amount;

  const handleDonate = () => {
    const selected = PRESET_AMOUNTS.find((preset) => preset.amount === amount);
    if (!selected) return;
    window.open(selected.link, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="donate-dialog__body">
      <p className="modal__intro">Pick an amount to donate.</p>

      <div className="donate-dialog__presets" role="group" aria-label="Preset donation amounts">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset.amount}
            type="button"
            className={`donate-dialog__preset ${amount === preset.amount ? 'is-selected' : ''}`}
            aria-pressed={amount === preset.amount}
            onClick={() => setAmount(preset.amount)}
          >
            R{preset.amount}
          </button>
        ))}
      </div>

      <p className="modal__note">You will be redirected to Yoco's secure payment page.</p>

      <button
        type="button"
        className="modal__submit"
        disabled={donateDisabled}
        onClick={handleDonate}
      >
        {donateLabel}
      </button>
    </div>
  );
}

function DonateDialog({ isOpen, onClose }) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId} title="Donate to the campaign">
      <DonateForm key={isOpen} onClose={onClose} />
    </Modal>
  );
}

export default DonateDialog;
