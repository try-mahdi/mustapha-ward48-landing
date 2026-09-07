import logoOnPurple from '../assets/logo-on-purple.svg';
import Icon from './Icon.jsx';
import './SiteFooter.css';

const PAGES = [
  { key: 'home', href: '#home', label: 'Home' },
  { key: 'record', label: 'The record', disabled: true },
  { key: 'about', label: 'Meet Mustapha', disabled: true },
  { key: 'report', label: 'Report a problem', disabled: true },
];

const CONTACT = [
  { icon: 'phone', text: '071 966 1108' },
  { icon: 'message-circle', text: 'WhatsApp 071 966 1108' },
  { icon: 'map-pin', text: 'thaafirm@gmail.com' },
];

const SOCIAL = [
  {
    label: 'Instagram',
    href: '#',
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="var(--cream)" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" fill="none" stroke="var(--cream)" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="var(--cream)" />
      </>
    ),
  },
  {
    label: 'X',
    href: '#',
    path: (
      <path
        fill="var(--cream)"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    label: 'Spotify',
    href: '#',
    path: (
      <path
        fill="var(--cream)"
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.19 8.19 0 004.77 1.52V6.79a4.86 4.86 0 01-1.01-.1z"
      />
    ),
  },
];

function SiteFooter() {
  return (
    <footer id='site-footer' className="site-footer">
      <div className="site-footer__grid">
        <div>
          <img
            src={logoOnPurple}
            alt="Mustapha for Ward 48"
            className="site-footer__logo"
            width={160}
            height={112}
          />
          <p className="site-footer__blurb">
            Home is Ward 48. So is the campaign.
          </p>
        </div>

        <div>
          <h3 className="site-footer__heading">Pages</h3>
          <ul className="site-footer__list">
            {PAGES.map((page) =>
              page.disabled ? (
                <li key={page.key}>
                  <span className="site-footer__link is-disabled" aria-disabled="true">
                    {page.label}
                  </span>
                </li>
              ) : (
                <li key={page.key}>
                  <a href={page.href} className="site-footer__link">
                    {page.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Find us</h3>
          <ul className="site-footer__list site-footer__list--contact">
            {CONTACT.map((item) => (
              <li key={item.text} className="site-footer__contact-item">
                <Icon name={item.icon} size={18} color="var(--gold)" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Follow</h3>
          <ul className="site-footer__social">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="site-footer__social-link" aria-label={item.label}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    {item.path}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="site-footer__legal">
        Paid for by the Mustapha for Ward 48 campaign. Not funded by any political party.
      </p>
      <p className="site-footer__credit">
        Site created by{' '}
        <a href="https://mahdidavids.com" target="_blank" rel="noopener noreferrer">
          mahdidavids.com
        </a>
      </p>
    </footer>
  );
}

export default SiteFooter;
