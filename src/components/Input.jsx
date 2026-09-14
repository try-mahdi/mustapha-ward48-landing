import { useId } from 'react';
import './Input.css';

function Input({ label, hint, error, required = false, id, className = '', multiline = false, ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const Control = multiline ? 'textarea' : 'input';

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
      <Control id={inputId} className="field__control" required={required} {...rest} />
      {(hint || error) && <span className="field__hint">{error || hint}</span>}
    </label>
  );
}

export default Input;
