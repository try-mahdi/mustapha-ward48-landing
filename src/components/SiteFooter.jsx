import { Link } from 'react-router-dom';
import logoOnPurple from '../assets/logo-on-purple.svg';
import Icon from './Icon.jsx';
import './SiteFooter.css';

const PAGES = [
  { key: 'home', to: '/', label: 'Home' },
  { key: 'plan', to: '/the-plan', label: 'The Plan' },
  { key: 'about', to: '/meet-thaafir', label: 'Meet Thaafir' },
  { key: 'volunteer', to: '/volunteer', label: 'Volunteer' },
  { key: 'report', label: 'Report a problem', disabled: true },
];

const CONTACT = [
  // { icon: 'phone', text: '071 966 1108' },
  // { icon: 'message-circle', text: 'WhatsApp 071 966 1108' },
  { icon: 'mail', text: 'admin@thaafirmustapha.com', href: 'mailto:admin@thaafirmustapha.com' },
];

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/thaafirmustapha',
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
    href: 'https://x.com/thaafirmustapha',
    path: (
      <path
        fill="var(--cream)"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    label: 'Tiktok',
    href: 'https://www.tiktok.com/@thaafirmustapha',
    path: (
      <path
        fill="var(--cream)"
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.19 8.19 0 004.77 1.52V6.79a4.86 4.86 0 01-1.01-.1z"
      />
    ),
  },
  {
    label: 'WhatsApp channel',
    href: 'https://whatsapp.com/channel/0029Vb8pPCJId7nItudcYV3N',
    path: (
      <path
        fill="var(--cream)"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
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
            width={644}
            height={162}
          />
          <p className="site-footer__blurb">
            An independent voice for Ward 48.
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
                  <Link to={page.to} className="site-footer__link">
                    {page.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Let's talk</h3>
          <ul className="site-footer__list site-footer__list--contact">
            {CONTACT.map((item) => (
              <li key={item.text} className="site-footer__contact-item">
                <Icon name={item.icon} size={18} color="var(--gold)" />
                {item.href ? (
                  <a href={item.href} className="site-footer__contact-link">
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Follow</h3>
          <ul className="site-footer__social">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="site-footer__social-link"
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
        developed by{' '}
        <a href="https://mahdidavids.com" target="_blank" rel="noopener noreferrer">
          mahdidavids.com
        </a>
      </p>
    </footer>
  );
}

export default SiteFooter;
