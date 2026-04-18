import React from 'react';
import { Link } from 'react-router-dom';
import './FinalCTA.css';

const FinalCTA = ({ title, btnText, btnLink }) => {
  if (!title) return null;

  return (
    <section className="final-cta" style={{ padding: '80px 0', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.05))', borderTop: '1px solid var(--border-color)' }}>
      <div className="final-cta__content" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>{title}</h2>
        {btnText && (
          <Link to={btnLink || "/contact"} className="btn primary" style={{ padding: '14px 30px', fontSize: '16px' }}>
            {btnText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default FinalCTA;