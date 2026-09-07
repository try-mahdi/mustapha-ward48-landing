import './Button.css';

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  href,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
