import { useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoOnPurple from '../assets/logo-on-purple.svg';
import Button from './Button.jsx';
import './SiteHeader.css';

const NAV_LINKS = [
  { key: 'home', to: '/', label: 'Home' },
  { key: 'plan', to: '/the-plan', label: 'The Plan' },
  { key: 'about', to: '/meet-thaafir', label: 'Meet Thaafir' },
  { key: 'report', label: 'Report a problem', disabled: true },
];

function SiteHeader({ onContactClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();

  return (
    <header className="site-header">
      <nav className="site-header__bar" aria-label="Primary">
        <Link to="/" className="site-header__brand">
          <img
            src={logoOnPurple}
            alt="Mustapha for Ward 48"
            width={644}
            height={162}
            className="site-header__logo"
          />
        </Link>

        <ul id={menuId} className={`site-header__links ${menuOpen ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) =>
            link.disabled ? (
              <li key={link.key}>
                <span className="site-header__link is-disabled" aria-disabled="true">
                  {link.label}
                </span>
              </li>
            ) : (
              <li key={link.key}>
                <Link
                  to={link.to}
                  className="site-header__link"
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
          <li className="site-header__cta">
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setMenuOpen(false);
                onContactClick();
              }}
            >
              Let's talk
            </Button>
          </li>
        </ul>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <g stroke="var(--cream)" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </g>
            ) : (
              <g stroke="var(--cream)" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </g>
            )}
          </svg>
        </button>
      </nav>
    </header>
  );
}

export default SiteHeader;
