import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await axios.get('/certifications'); 
        setCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications", error);
      }
    };
    fetchCerts();
  }, []);

  if (certifications.length === 0) return null;

  return (
    <section className="certifications-section" id="certifications" style={{ padding: '4rem 0' }}>
      <h2 className="section__title">My Certifications</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '2rem' }}>
        {certifications.map(cert => (
          <div key={cert._id} style={{ 
            border: '1px solid var(--border-color, #2a344a)', 
            padding: '25px', 
            borderRadius: '12px',
            backgroundColor: 'var(--card-bg, #111827)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {cert.imageUrl && (
                <img 
                  src={cert.imageUrl} 
                  alt={cert.title} 
                  style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '15px' }} 
                />
              )}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-color, #fff)' }}>
                {cert.title}
              </h3>
              <p style={{ color: 'var(--text-muted, #9ca3af)', fontSize: '0.95rem' }}>
                {cert.issuer} {cert.date ? `| ${cert.date}` : ''}
              </p>
            </div>

            {/* 🔥 THIS IS YOUR NEW VIEW BUTTON 🔥 */}
            {cert.credentialUrl && (
              <a 
                href={cert.credentialUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'inline-block', 
                  marginTop: '20px', 
                  padding: '10px 20px', 
                  backgroundColor: '#3399cc', // using your theme's blue
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '6px', 
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#287aa3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3399cc'}
              >
                View Certificate ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;