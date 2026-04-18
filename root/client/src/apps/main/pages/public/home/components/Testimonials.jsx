import React, { useState, useEffect } from 'react';
import axios from '../../../../../core/utils/axios';
import './Testimonials.css';

const Testimonials = ({ heading }) => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('/testimonials');
        setTestimonials(res.data || []);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="testimonials-preview" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>{heading || "What People Say"}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {testimonials.map((test, idx) => (
          <div key={idx} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>"{test.message}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                {test.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>{test.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{test.role || "Client"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;