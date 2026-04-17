import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

import './Experience.module.css';

export default function Experience() {
  const experiences = [
    {
      role: "Freelance Full-Stack Developer",
      company: "Independent / Client Projects",
      duration: "Jan 2025 - Present",
      description: [
        "Designed and developed full-stack web applications for various clients using the MERN stack and Spring Boot.",
        "Engineered custom cloud solutions and integrated DevOps pipelines to ensure highly available and scalable architectures.",
        "Optimized database queries and API endpoints, resulting in significantly faster load times and improved user experiences.",
        "Provided technical consultation on system architecture, database design (MongoDB/MySQL), and cloud deployment."
      ],
      techStack: ["React.js", "Node.js", "Spring Boot", "MongoDB", "Docker"]
    },
    {
      role: "Lead Developer & Architect",
      company: "Smartsphaere & BuddyBot (Projects)",
      duration: "Oct 2025 - Present",
      description: [
        "Architected Smartsphaere, a comprehensive smart cloud aggregator dashboard designed to centralize and manage cloud resources efficiently.",
        "Built BuddyBot, a highly interactive ChatGPT clone utilizing the MERN stack with seamless conversation history and real-time AI responses.",
        "Integrated local, open-source LLMs (Mistral, Llama) using Ollama for advanced, secure data processing.",
        "Managed the complete CI/CD lifecycle and deployment strategies for these platforms."
      ],
      techStack: ["MERN Stack", "Ollama (LLMs)", "DevOps", "Tailwind CSS"]
    }
  ];

  return (
    <section className="about__section" id="experience">
      <div className="container">
        
        <div className="section__header">
          <h2>Experience & Leadership</h2>
          <p>My professional background, freelance work, and major architectural projects.</p>
        </div>

        <div className="experience__timeline">
          {experiences.map((exp, index) => (
            <div className="experience__item" key={index}>
              <div className="experience__dot"></div>
              
              <div className="experience__card">
                <div className="experience__header">
                  <div>
                    <h3 className="experience__role">{exp.role}</h3>
                    <div className="experience__company">{exp.company}</div>
                  </div>
                  <div className="experience__date">
                    <FaCalendarAlt /> {exp.duration}
                  </div>
                </div>

                <ul className="experience__desc">
                  {exp.description.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <div className="experience__tech">
                  {exp.techStack.map((tech, idx) => (
                    <span key={idx}>{tech}</span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}