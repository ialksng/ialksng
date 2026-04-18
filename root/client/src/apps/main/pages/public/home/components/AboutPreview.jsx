import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaArrowRight } from 'react-icons/fa';

import './AboutPreview.css';

export default function AboutPreview() {
  return (
    <section className="home__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="about__preview-content">
          
          <div className="about__preview-text">
            <h2 className="gradient-text">Behind the Code</h2>
            <p>
              I'm a Full-Stack Architect and CSE student with a passion for building 
              scalable cloud systems and AI-driven applications. With a 9.0 CGPA 
              and a background in freelance development, I bridge the gap between 
              academic excellence and real-world software engineering.
            </p>
            <Link to="/about" className="btn btn__primary">
              Learn More About Me <FaArrowRight style={{marginLeft: '8px'}} />
            </Link>
          </div>

          <div className="about__preview-stats">
            <div className="stat__item">
              <h3>9.0</h3>
              <p>Current CGPA</p>
            </div>
            <div className="stat__item">
              <h3>15+</h3>
              <p>Projects Built</p>
            </div>
            <div className="stat__item">
              <h3>1700+</h3>
              <p>LeetCode Rating</p>
            </div>
            <div className="stat__item">
              <h3>2+</h3>
              <p>Years Experience</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}