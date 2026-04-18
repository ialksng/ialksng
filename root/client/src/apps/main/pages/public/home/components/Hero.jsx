import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({ title, subtitle, btn1Text, btn1Link, btn2Text, btn2Link }) => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1>{title || "Welcome to My Platform"}</h1>
        <p>{subtitle || "Discover my work, read my thoughts, and explore my digital products."}</p>
        
        <div className="hero__actions">
          {btn1Text && (
            <Link to={btn1Link || "/"} className="btn primary">
              {btn1Text}
            </Link>
          )}
          {btn2Text && (
            <Link to={btn2Link || "/"} className="btn secondary">
              {btn2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;