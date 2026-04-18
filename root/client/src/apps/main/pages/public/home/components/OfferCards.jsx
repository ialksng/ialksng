import React from 'react';
import { Link } from 'react-router-dom';

const OfferCards = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="offer-cards" style={{ padding: '60px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '32px', marginBottom: '15px' }}>{card.iconName || "✨"}</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{card.title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>{card.description}</p>
          {card.link && <Link to={card.link} style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Learn more →</Link>}
        </div>
      ))}
    </section>
  );
};

export default OfferCards;