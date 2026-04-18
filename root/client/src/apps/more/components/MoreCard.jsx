import React from 'react';
import { Link } from 'react-router-dom';

const MoreCard = ({ title, description, to, icon, badge }) => {
  return (
    <Link to={to} className="more-card">
      <div className="more-card-header">
        <span className="more-card-icon">{icon}</span>
        {badge && (
          <span className={`more-card-badge ${badge === 'LIVE' ? 'live-pulse' : ''}`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="more-card-title">{title}</h3>
      <p className="more-card-desc">{description}</p>
    </Link>
  );
};

export default MoreCard;