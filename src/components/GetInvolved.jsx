import Icon from './Icon.jsx';
import './GetInvolved.css';

const LINKS = [
  { key: 'donate', icon: 'heart-handshake', label: 'Donate', action: 'donate' },
  { key: 'contact', icon: 'mail', label: 'Contact us', action: 'contact' },
  // { key: 'volunteer', icon: 'users', label: 'Volunteer', href: '#' },
];

function GetInvolved({ onDonateClick, onContactClick }) {
  return (
    <div className="get-involved">
      <p className="get-involved__eyebrow">Take action</p>
      <h2 className="get-involved__title">Get involved</h2>
      <ul className="get-involved__list">
        {LINKS.map((item) => {
          const content = (
            <>
              <Icon name={item.icon} size={22} color="var(--purple)" />
              <span className="get-involved__label">{item.label}</span>
              <Icon name="arrow-right" size={18} color="var(--purple)" />
            </>
          );

          if (item.action === 'donate') {
            return (
              <li key={item.key}>
                <button type="button" className="get-involved__link" onClick={onDonateClick}>
                  {content}
                </button>
              </li>
            );
          }

          if (item.action === 'contact') {
            return (
              <li key={item.key}>
                <button type="button" className="get-involved__link" onClick={onContactClick}>
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <a href={item.href} className="get-involved__link">
                {content}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default GetInvolved;
