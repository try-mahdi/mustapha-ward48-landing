import { useState } from 'react';

export const PRESET_AMOUNTS = [20, 50, 100];

// Mirrors the bounds enforced server-side in
// supabase/functions/create-yoco-checkout — kept in sync manually since the
// two run in different runtimes.
export const MIN_AMOUNT = 10;
export const MAX_AMOUNT = 50_000;

// A dedicated backend endpoint that creates a fresh, single-use Yoco
// Checkout session per request (see supabase/functions/create-yoco-checkout).
// Static Yoco Payment Links are reusable, so once one donor pays, the same
// link keeps showing "already paid" to everyone after them — this replaces
// that with a checkout minted just for this donor.
const CHECKOUT_ENDPOINT = import.meta.env.VITE_DONATION_CHECKOUT_URL;

function getCustomAmountError(customAmount) {
  if (customAmount === '') return null;
  const parsed = Number(customAmount);
  if (!Number.isInteger(parsed)) return 'Enter a whole number of rand.';
  if (parsed < MIN_AMOUNT) return `Minimum donation is R${MIN_AMOUNT}.`;
  if (parsed > MAX_AMOUNT) {
    return `For amounts over R${MAX_AMOUNT.toLocaleString()}, please get in touch directly.`;
  }
  return null;
}

// Owns all the state and behaviour behind the donate form — amount
// selection, custom-amount validation, and kicking off a Yoco checkout —
// so Donation.jsx only has to render whatever this returns.
export function useDonation() {
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error

  const donateLabel =
    status === 'loading' ? 'Redirecting…' : amount ? `Donate R${amount}` : 'Select an amount';
  const donateDisabled = !amount || status === 'loading';

  const selectPreset = (preset) => {
    setAmount(preset);
    setCustomAmount('');
  };

  const changeCustomAmount = (raw) => {
    setCustomAmount(raw);
    setAmount(getCustomAmountError(raw) || raw === '' ? null : Number(raw));
  };

  const submitDonation = async () => {
    if (!amount || status === 'loading') return;
    setStatus('loading');

    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error(`Checkout request failed (${res.status})`);

      const { redirectUrl } = await res.json();
      if (!redirectUrl) throw new Error('No redirect URL returned');

      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Failed to start Yoco checkout:', err);
      setStatus('error');
    }
  };

  return {
    presetAmounts: PRESET_AMOUNTS,
    amount,
    customAmount,
    customAmountError: getCustomAmountError(customAmount),
    status,
    donateLabel,
    donateDisabled,
    selectPreset,
    changeCustomAmount,
    submitDonation,
  };
}
