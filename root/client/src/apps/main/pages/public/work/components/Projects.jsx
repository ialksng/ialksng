import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import axios from "../../../../../../core/utils/axios";
import Loader from "../../../../../../core/components/Loader";

import "./Projects.module.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("/projects");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="projects" id="projects">
        <Loader />
      </section>
    );
  }

  return (
    <section className="projects" id="projects">
      <h2 className="projects__title">Projects</h2>
      <p className="projects__subtitle">Some of my recent work</p>

      {projects.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>No projects added yet.</p>
      ) : (
        <div className="projects__grid">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || index}
              className="project__card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* IMAGE */}
              <div className="project__image">
                <img src={project.imageUrl || "/projects/project1.jpg"} alt={project.title} />

                {/* OVERLAY */}
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
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;