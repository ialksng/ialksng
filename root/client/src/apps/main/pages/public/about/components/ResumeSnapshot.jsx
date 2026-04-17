import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaTimes, FaMapMarkerAlt, FaGraduationCap, FaBookReader } from 'react-icons/fa';

import './ResumeSnapshot.css'; 

export default function ResumeSnapshot() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DRIVE_FILE_ID = "1RncZCzY-fZBqLkT_UtHpZw1RdW2ajCEv"; 

  const embedUrl = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  return (
    <section className="about__section">
      <div className="container">
        <div className="section__header">
          <h2>Resume Snapshot</h2>
          <p>A quick overview of my current status and focus areas.</p>
        </div>

        <div className="resume__snapshot-card">
          
          <div className="snapshot__grid">
            <div className="snapshot__item">
              <FaGraduationCap className="snapshot__icon" />
              <div>
                <h4>Education</h4>
                <p>3rd Year B.Tech in Computer Science Engineering (CSE)</p>
                <span className="highlight-text">9.0 CGPA</span>
              </div>
            </div>

            <div className="snapshot__item">
              <FaMapMarkerAlt className="snapshot__icon" />
              <div>
                <h4>Location</h4>
                <p>Greater Noida, India</p>
                <span className="highlight-text">Open to Remote & Relocation</span>
              </div>
            </div>

            <div className="snapshot__item">
              <FaBookReader className="snapshot__icon" />
              <div>
                <h4>Current Focus</h4>
                <p>MERN Stack, Data Science, & DevOps</p>
                <span className="highlight-text">Preparing for GATE CS/IT & GSoC</span>
              </div>
            </div>
          </div>

          <div className="snapshot__action">
            <button className="btn btn__primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
              <FaFilePdf /> View Full Resume
            </button>
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div className="modal__overlay" onClick={() => setIsModalOpen(false)}>
          
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal__header">
              <h3>Alok_Singh_Resume.pdf</h3>
              <button className="modal__close-btn" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal__body">
              <iframe 
                src={embedUrl} 
                title="Alok Singh Resume"
                className="pdf__iframe"
                allow="autoplay"
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>

            <div className="modal__footer">
              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn__outline" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaDownload /> Download Resume
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}