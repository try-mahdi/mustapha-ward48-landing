import { useId, useState } from 'react';
import Modal from './Modal.jsx';
import './DonateDialog.css';

const PRESET_AMOUNTS = [20, 50, 100];

function DonateForm({ onClose }) {
  const [amount, setAmount] = useState(null);
  const [customValue, setCustomValue] = useState('');
  const customInputId = useId();

  const selectedValue = amount === 'custom' ? customValue : amount;
  const donateLabel = selectedValue ? `Donate R${selectedValue}` : 'Select an amount';
  const donateDisabled = !selectedValue;

  return (
    <div className="donate-dialog__body">
      <p className="modal__intro">Pick an amount or enter your own.</p>

      <div className="donate-dialog__presets" role="group" aria-label="Preset donation amounts">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`donate-dialog__preset ${amount === preset ? 'is-selected' : ''}`}
            aria-pressed={amount === preset}
            onClick={() => {
              setAmount(preset);
              setCustomValue('');
            }}
          >
            R{preset}
          </button>
        ))}
      </div>

      <div className={`donate-dialog__custom ${amount === 'custom' ? 'is-selected' : ''}`}>
        <label htmlFor={customInputId} className="sr-only">
          Other amount, in Rand
        </label>
        <span className="donate-dialog__currency" aria-hidden="true">
          R
        </span>
        <input
          id={customInputId}
          type="number"
          min="1"
          inputMode="numeric"
          placeholder="Other amount"
          value={customValue}
          onFocus={() => setAmount('custom')}
          onChange={(event) => {
            setAmount('custom');
            setCustomValue(event.target.value);
          }}
        />
      </div>

      <p className="modal__note">You will be redirected to a secure payment page.</p>

      <button
        type="button"
        className="modal__submit"
        disabled={donateDisabled}
        onClick={onClose}
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
