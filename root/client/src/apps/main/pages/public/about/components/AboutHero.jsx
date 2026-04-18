import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaEnvelope } from 'react-icons/fa';

import "./AboutHero.css";

export default function AboutHero() {
  return (
    <section className="about__hero">
      <div className="container about__hero-container">

        <div className="about__hero-content">
          <h1 className="about__title">
            Hi, I'm <span className="gradient-text">Alok Singh</span>
          </h1>
          <h2 className="about__subtitle">
            Computer Science Engineer & Full-Stack Developer
          </h2>
          <p className="about__desc">
            I specialize in the MERN stack and Spring Boot, building scalable web applications, 
            smart cloud architectures, and robust APIs. With a strong foundation in Data Structures, 
            Algorithms, and DevOps, I engineer solutions that are both highly performant and user-centric.
          </p>
          
          <div className="hero__cta-group" style={{ justifyContent: 'flex-start' }}>
            <a href="/Alok_Singh_Resume.pdf" download className="btn btn__primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaDownload /> Download Resume
            </a>
            <Link to="/contact" className="btn btn__outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEnvelope /> Contact Me
            </Link>
          </div>
        </div>

        <div className="about__hero-image-wrapper">
          <img 
            src="https://lh3.googleusercontent.com/d/1pzQPbHLgL_0F5OiEokPi0mmgEhrTyTdX"
            alt="Alok Singh"
            className="about__profile-img"
          />
        </div>

      </div>
    </section>
  );
}