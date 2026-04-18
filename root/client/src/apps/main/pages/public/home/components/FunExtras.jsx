import React from 'react';
import './FunExtras.css';

const FunExtras = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="fun-extras" style={{ padding: '40px 0', borderTop: '1px solid var(--border-color)' }}>
      <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-box" style={{ padding: '20px' }}>
            <h3 className="stat-number" style={{ fontSize: '36px', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
              {stat.value}
              {stat.suffix && <span className="stat-suffix" style={{ color: 'var(--accent-primary)', fontSize: '24px' }}>{stat.suffix}</span>}
            </h3>
            <p className="stat-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px', margin: 0 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FunExtras;