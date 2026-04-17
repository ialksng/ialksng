import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaFolderOpen } from 'react-icons/fa';

import './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className="about__section">
      <div className="container">
        
        <div className="final__cta-container">
          <h2 className="final__cta-title">
            Let's Build Something <span className="gradient-text">Amazing</span>
          </h2>
          
          <p className="final__cta-desc">
            Whether you are looking to hire a dedicated MERN & Spring Boot developer, 
            need a custom web application built from scratch, or just want to connect over tech and open-source, 
            my inbox is always open.
          </p>
          
          <div className="final__cta-buttons">
            <Link to="/contact" className="btn btn__primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaPaperPlane /> Get In Touch
            </Link>
            
            <Link to="/projects" className="btn btn__outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaFolderOpen /> View My Work
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}