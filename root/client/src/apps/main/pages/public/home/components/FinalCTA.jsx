import React from 'react';
import { Link } from 'react-router-dom';

import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="container">
      <div className="home__final-cta">
        <h2>Let's Create Something Extraordinary</h2>
        <p>
          Need a robust MERN application, a Spring Boot backend, or an optimized 
          cloud deployment? I'm available for new projects and collaborations.
        </p>
        <div className="cta__btn-group">
          <Link to="/contact" className="btn__solid-white">
            Start a Conversation
          </Link>
          <Link to="/projects" className="btn__outline-white">
            Explore My Work
          </Link>
        </div>
      </div>
    </section>
  );
}