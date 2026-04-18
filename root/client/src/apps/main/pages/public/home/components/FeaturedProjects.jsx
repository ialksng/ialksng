import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../../../core/utils/axios';
import './FeaturedProjects.css';

const FeaturedProjects = ({ heading }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects');
        setProjects(res.data?.projects?.slice(0, 2) || []); 
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <section className="featured-projects" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h2>{heading || "Featured Work"}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {projects.map((project, idx) => (
          <div key={project._id} style={{ display: 'grid', gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '30px', alignItems: 'center' }}>
            <div style={{ order: idx % 2 === 0 ? 1 : 2 }}>
              <img src={project.image || "https://via.placeholder.com/600"} alt={project.title} style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ order: idx % 2 === 0 ? 2 : 1 }}>
              <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>{project.description}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn primary">Live Demo</a>}
                {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn secondary">GitHub</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', margin: '40px auto 0 auto' }}>
        <Link to="/work" className="btn secondary">View All Projects</Link>
      </div>
    </section>
  );
};

export default FeaturedProjects;