import React from 'react';
import { FaStar } from 'react-icons/fa';

import './Testimonials.module.css';

export default function Testimonials() {
  const testimonials = [
    {
      text: "Alok's ability to architect scalable MERN applications is impressive. He delivered our cloud dashboard ahead of schedule with zero bugs in the production environment.",
      name: "Sandeep Kumar",
      role: "Tech Lead, StartupX",
      initials: "SK"
    },
    {
      text: "Working with him on BuddyBot was seamless. His deep understanding of LLMs and Ollama integration helped us build a cutting-edge AI interface in weeks.",
      name: "Jessica Chen",
      role: "Founder, AI Solutions",
      initials: "JC"
    },
    {
      text: "A dedicated developer with a strong grasp of Spring Boot and Java. His 9.0 CGPA reflects in the quality and discipline of his code architecture.",
      name: "Dr. Rajesh V.",
      role: "Professor, CSE Dept",
      initials: "RV"
    }
  ];

  return (
    <section className="home__section">
      <div className="container">
        <div className="section__header">
          <h2>Client Feedback</h2>
          <p>Voices from those I've collaborated with on technical projects.</p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, index) => (
            <div className="testimonial__card" key={index}>
              <div className="testimonial__stars">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <p className="testimonial__text">{t.text}</p>
              <div className="testimonial__author">
                <div className="author__avatar">{t.initials}</div>
                <div className="author__info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}