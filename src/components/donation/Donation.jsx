import { useId } from 'react';
import Modal from '../Modal.jsx';
import Input from '../Input.jsx';
import { useDonation, MIN_AMOUNT, MAX_AMOUNT } from '../../hooks/useDonation.js';
import './Donation.styles.css';

function DonationForm() {
  const {
    presetAmounts,
    amount,
    customAmount,
    customAmountError,
    status,
    donateLabel,
    donateDisabled,
    selectPreset,
    changeCustomAmount,
    submitDonation,
  } = useDonation();

  return (
    <div className="donation__body">
      <p className="modal__intro">Pick an amount to donate.</p>

      <div className="donation__presets" role="group" aria-label="Preset donation amounts">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`donation__preset ${amount === preset ? 'is-selected' : ''}`}
            aria-pressed={amount === preset}
            disabled={status === 'loading'}
            onClick={() => selectPreset(preset)}
          >
            R{preset}
          </button>
        ))}
      </div>

      <Input
        label="Or enter your own amount (ZAR)"
        name="customAmount"
        type="number"
        inputMode="numeric"
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        step="1"
        placeholder="e.g. 75"
        value={customAmount}
        onChange={(event) => changeCustomAmount(event.target.value)}
        error={customAmountError}
        disabled={status === 'loading'}
      />

      <p className="modal__note">You will be redirected to Yoco's secure payment page.</p>

      {status === 'error' && (
        <p className="donation__error" role="alert">
          Something went wrong starting your donation. Please try again.
        </p>
      )}

      <button
        type="button"
        className="modal__submit"
        disabled={donateDisabled}
        onClick={submitDonation}
      >
        {donateLabel}
      </button>
    </div>
  );
}

function Donation({ isOpen, onClose }) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId} title="Donate to the campaign">
      <DonationForm key={isOpen} />
    </Modal>
  );
}

export default Donation;
