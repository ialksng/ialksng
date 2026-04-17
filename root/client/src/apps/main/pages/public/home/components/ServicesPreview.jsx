import React from 'react';
import { FaLaptopCode, FaServer, FaInfinity } from 'react-icons/fa';

import './ServicesPreview.module.css';

export default function ServicesPreview() {
  const services = [
    {
      title: "Full-Stack Development",
      description: "End-to-end web application architecture using the MERN stack and Spring Boot. I build responsive, highly interactive frontends paired with secure, scalable backend systems.",
      icon: <FaLaptopCode />
    },
    {
      title: "API & System Architecture",
      description: "Designing robust RESTful APIs and optimizing complex database schemas in MongoDB and MySQL. Focused on algorithmic efficiency to ensure lightning-fast data retrieval.",
      icon: <FaServer />
    },
    {
      title: "Cloud & DevOps Integration",
      description: "Streamlining deployments with Docker, CI/CD pipelines, and cloud hosting solutions to guarantee high availability and seamless updates for your platforms.",
      icon: <FaInfinity />
    }
  ];

  return (
    <section className="home__section">
      <div className="container">
        
        <div className="section__header">
          <h2>Specialized Services</h2>
          <p>Technical solutions designed for scalability and performance.</p>
        </div>

        <div className="services__grid">
          {services.map((service, index) => (
            <div className="service__card" key={index}>
              <div className="service__icon">
                {service.icon}
              </div>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__desc">{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}