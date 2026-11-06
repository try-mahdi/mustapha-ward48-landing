import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import './GetInvolved.css';

const LINKS = [
  { key: 'volunteer', icon: 'users', label: 'Volunteer', to: '/volunteer' },
];

function GetInvolved() {
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

          return (
            <li key={item.key}>
              <Link to={item.to} className="get-involved__link">
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default GetInvolved;
