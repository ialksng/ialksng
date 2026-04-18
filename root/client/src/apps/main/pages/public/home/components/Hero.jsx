import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ title, subtitle, btn1Text, btn1Link, btn2Text, btn2Link }) => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1>{title || "Welcome"}</h1>
        <p>{subtitle || "My Subtitle"}</p>
        
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