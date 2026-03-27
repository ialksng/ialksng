import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await axios.get('/api/certifications');
        setCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications", error);
      }
    };
    fetchCerts();
  }, []);

  if (certifications.length === 0) return null; // Don't show section if empty

  return (
    <section className="certifications-section" id="certifications" style={{ padding: '4rem 2rem' }}>
      <h2>My Certifications</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {certifications.map(cert => (
          <div key={cert._id} style={{ border: '1px solid #eaeaea', padding: '20px', borderRadius: '8px' }}>
            {cert.imageUrl && <img src={cert.imageUrl} alt={cert.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />}
            <h3 style={{ marginTop: '10px' }}>{cert.title}</h3>
            <p>{cert.issuer} | {cert.date}</p>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', color: 'blue' }}>
                View Credential &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;