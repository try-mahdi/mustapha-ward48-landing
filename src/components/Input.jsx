import { useId } from 'react';
import './Input.css';

function Input({ label, hint, error, required = false, id, className = '', ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label htmlFor={inputId} className={`field ${error ? 'field--error' : ''} ${className}`}>
      <span className="field__label">
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      <input id={inputId} className="field__control" required={required} {...rest} />
      {(hint || error) && <span className="field__hint">{error || hint}</span>}
    </label>
  );
}

export default Input;
