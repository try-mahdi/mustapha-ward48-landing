import Icon from './Icon.jsx';
import './IconButton.css';

function IconButton({ icon = 'menu', label, variant = 'secondary', size = 44, onClick, className = '', ...rest }) {
  const classes = ['icon-btn', `icon-btn--${variant}`, className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={classes}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} color="currentColor" />
    </button>
  );
}

export default IconButton;
