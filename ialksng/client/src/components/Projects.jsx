import "../styles/projects.css"
import { motion } from "framer-motion"

function Projects() {
  const projects = [
    {
      title: "Ride Booking App",
      desc: "Full-stack MERN app like Rapido",
      tech: "React • Node • MongoDB",
      img: "/projects/project1.jpg",
      github: "#",
      live: "#"
    },
    {
      title: "Portfolio Website",
      desc: "Modern developer portfolio",
      tech: "React • CSS",
      img: "/projects/project2.jpg",
      github: "#",
      live: "#"
    },
    {
      title: "Notes Selling Platform",
      desc: "E-commerce platform for students",
      tech: "MERN Stack",
      img: "/projects/project3.jpg",
      github: "#",
      live: "#"
    }
  ]

  return (
    <section className="projects" id="projects">

      <h2 className="projects__title">Projects</h2>
      <p className="projects__subtitle">Some of my recent work</p>

      <div className="projects__grid">
        {projects.map((project, index) => (

          <motion.div
            key={index}
            className="project__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >

            {/* IMAGE */}
            <div className="project__image">
              <img src={project.img} alt={project.title} />

              {/* OVERLAY */}
              <div className="project__overlay">
                <a href={project.live} target="_blank">Live</a>
                <a href={project.github} target="_blank">GitHub</a>
              </div>
            </div>

            {/* CONTENT */}
            <div className="project__content">
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <span>{project.tech}</span>
            </div>

          </motion.div>

        ))}
      </div>

    </section>
  )
}

export default Projects