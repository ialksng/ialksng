import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import axios from '../../../../../../core/utils/axios';

import './FeaturedProjects.css';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/projects');
        // If your DB has a featured flag, use: data.filter(p => p.isFeatured).slice(0, 2)
        // Otherwise, this just grabs the 2 most recent projects:
        setProjects(data.slice(0, 2)); 
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No projects found.</div>
        ) : (
          <div className="featured__projects-grid">
            {projects.map((project) => (
              <div className="project__card" key={project._id || project.id}>
                <div className="project__image-container">
                  {project.imageUrl || project.image ? (
                     <img src={project.imageUrl || project.image} alt={project.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div className="project__image-placeholder">
                      <span>[ {project.title} Image ]</span>
                    </div>
                  )}
                </div>

                <div className="project__content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project__tech">
                    {/* Add fallback to empty array if techStack is undefined */}
                    {(project.techStack || []).map((tech, idx) => (
                      <span key={idx}>{typeof tech === 'object' ? tech.name : tech}</span>
                    ))}
                  </div>

                  <div className="project__links">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn__outline btn__small">
                        <FaGithub /> Source Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn btn__primary btn__small">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}