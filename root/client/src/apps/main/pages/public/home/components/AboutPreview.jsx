import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../../../core/utils/axios';
import './AboutPreview.css';

const AboutPreview = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutSnippet = async () => {
      try {
        const res = await axios.get('/about');
        setAboutData(res.data);
      } catch (err) {
        console.error("Failed to fetch about data for preview", err);
      }
    };
    fetchAboutSnippet();
  }, []);

  if (!aboutData) return null;

  return (
    <section className="about-preview" style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '40px 0' }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Hi, I'm {aboutData.name?.split(' ')[0] || "Alok"}</h2>
          <h3 style={{ color: 'var(--accent-primary)', fontSize: '18px', marginBottom: '20px' }}>{aboutData.role}</h3>
          
          {/* Show the first paragraph of the about bio */}
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
            {aboutData.paragraphs && aboutData.paragraphs.length > 0 
              ? aboutData.paragraphs[0] 
              : "I build high-performance digital solutions."}
          </p>
          
          <Link to="/about" className="btn primary">Read Full Story</Link>
        </div>

        {aboutData.imageUrl && (
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--border-color)' }}>
              <img src={aboutData.imageUrl} alt={aboutData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default AboutPreview;