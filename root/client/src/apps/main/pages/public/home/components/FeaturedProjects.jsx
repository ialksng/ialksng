import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from '../../../../../../core/utils/axios';

// Import exact same CSS used in your projects page
import '../../work/components/Projects.css';
import './FeaturedProjects.css';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/projects');
        setProjects(data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="home__section projects" id="projects" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
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
          <div className="projects__grid">
            {projects.map((project, index) => (
              <div className="project__card" key={project._id || index}>
                {/* IMAGE WITH OVERLAY - Matching Projects.jsx */}
                <div className="project__image">
                  <img src={project.imageUrl || "/projects/project1.jpg"} alt={project.title} />

                  <div className="project__overlay">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="project__content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span>{project.tools ? project.tools.join(" • ") : ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}