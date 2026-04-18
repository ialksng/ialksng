import React from 'react';
import { Link } from 'react-router-dom';
import './ServicesPreview.css';

const ServicesPreview = ({ heading, services }) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="services-preview" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>{heading || "Services"}</h2>
      </div>

      <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {services.map((service, index) => (
          <div key={index} className="service-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div className="service-icon" style={{ fontSize: '32px', marginBottom: '15px' }}>
              {service.iconName || "💻"}
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>{service.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPreview;