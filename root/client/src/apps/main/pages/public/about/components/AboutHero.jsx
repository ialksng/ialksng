import React from 'react';

const AboutHero = ({ name, role, imageUrl, stats }) => {
  return (
    <section className="about-hero">
      <div className="about-hero__content">

        <h1>{name || "Your Name"}</h1>
        <h2>{role || "Your Role"}</h2>
        
        <div className="about-hero__stats">
          {stats && stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="about-hero__image">

        <img src={imageUrl || "https://via.placeholder.com/300"} alt={name} />
      </div>
    </section>
  );
};

export default AboutHero;