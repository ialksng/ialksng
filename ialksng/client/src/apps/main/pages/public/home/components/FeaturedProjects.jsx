import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

import './FeaturedProjects.module.css';

export default function FeaturedProjects() {
  const projects = [
    {
      title: "Smartsphaere",
      description: "A comprehensive smart cloud aggregator dashboard designed to centralize, manage, and monitor cloud resources efficiently across multiple providers.",
      techStack: ["React.js", "Node.js", "Express", "MongoDB", "Docker"],
      githubLink: "https://github.com/ialksng/smartsphere",
      liveLink: "#", 
      imagePlaceholder: "Cloud Architecture Dashboard"
    },
    {
      title: "BuddyBot",
      description: "A highly interactive, MERN-based ChatGPT clone featuring real-time AI streaming, robust conversation history, and local open-source LLM integration.",
      techStack: ["MERN Stack", "Ollama", "Mistral/Llama", "Tailwind CSS"],
      githubLink: "https://github.com/ialksng/buddybot",
      liveLink: "#",
      imagePlaceholder: "AI Chat Interface"
    }
  ];

  return (
    <section className="home__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Featured Architecture</h2>
            <p>A glimpse into the scalable platforms and tools I am building.</p>
          </div>
          <Link to="/projects" className="view__all-btn">
            View All Projects <FaArrowRight />
          </Link>
        </div>

        <div className="featured__projects-grid">
          {projects.map((project, index) => (
            <div className="project__card" key={index}>
              <div className="project__image-container">
                <div className="project__image-placeholder">
                  <span>[ {project.imagePlaceholder} Image ]</span>
                </div>
              </div>

              <div className="project__content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                <div className="project__tech">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx}>{tech}</span>
                  ))}
                </div>

                <div className="project__links">
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn__outline btn__small">
                    <FaGithub /> Source Code
                  </a>
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn btn__primary btn__small">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}