import React from 'react';
import { Link } from 'react-router-dom';
import '../More.css';

const MoreCard = ({ 
  title, 
  icon, 
  to, 
  dynamicContent, 
  cta, 
  isLive, 
  featured, 
  delayIndex 
}) => {
  return (
    <Link 
      to={to} 
      className={`more-card ${featured ? 'more-card-featured' : ''}`}
      style={{ animationDelay: `${delayIndex * 100}ms` }}
    >
      <div className="more-card-top">
        <div className="more-card-header">
          <span className="more-card-icon">{icon}</span>
          {isLive !== undefined && (
            <div className={`status-badge ${isLive ? 'live-pulse' : 'offline'}`}>
              {isLive ? (
                <><span className="dot"></span> LIVE NOW</>
              ) : (
                'OFFLINE'
              )}
            </div>
          )}
        </div>
        <h3 className="more-card-title">{title}</h3>
        
        <div className="more-card-dynamic">
          {dynamicContent}
        </div>
      </div>

      <div className="more-card-footer">
        <span className="more-card-cta">
          {cta} 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default MoreCard;