import Profiles from "./Profiles"
import "../styles/about.css"
import profile from "../assets/Alok Singh.png"
import { useState } from "react"
import { motion } from "framer-motion"

import {
  FaReact, FaNodeJs, FaPython, FaJava, FaGitAlt, FaAws
} from "react-icons/fa"

import {
  SiMongodb, SiMysql, SiExpress, SiJavascript, SiDocker,
  SiHtml5,
  SiCss,
  SiBootstrap,
  SiTailwindcss
} from "react-icons/si"

function About() {
  const [active, setActive] = useState("All")

  const skills = [
    { name: "HTML5", category: "Frontend", icon: <SiHtml5 /> },
    { name: "CSS3", category: "Frontend", icon: <SiCss /> },
    { name: "JavaScript (ES6+)", category: "Frontend", icon: <SiJavascript /> },
    { name: "React", category: "Frontend", icon: <FaReact /> },
    { name: "Tailwind CSS", category: "Frontend", icon: <SiTailwindcss /> },
    { name: "BootStrap", category: "Frontend", icon: <SiBootstrap /> },

    { name: "Node.js", category: "Backend", icon: <FaNodeJs /> },
    { name: "Express", category: "Backend", icon: <SiExpress /> },

    { name: "MongoDB", category: "Databases", icon: <SiMongodb /> },
    { name: "MySQL", category: "Databases", icon: <SiMysql /> },

    { name: "Python", category: "Languages", icon: <FaPython /> },
    { name: "Java", category: "Languages", icon: <FaJava /> },

    { name: "Docker", category: "Tools", icon: <SiDocker /> },
    { name: "AWS", category: "Tools", icon: <FaAws /> },
    { name: "Git", category: "Tools", icon: <FaGitAlt /> },
  ]

  const filteredSkills =
    active === "All"
      ? skills
      : skills.filter(skill => skill.category === active)

  return (
    <section className="about" id="about">

      <h2 className="section__title">About Me</h2>

      {/* TOP SECTION */}
      <div className="about__top">

        {/* IMAGE */}
        <div className="about__image">
          <img src={profile} alt="Alok Singh" />
        </div>

        {/* CONTENT */}
        <div className="about__content card">

          <h3 className="about__role">Full Stack Developer</h3>
          <p>
            I'm Alok Singh, a passionate Full Stack Developer who builds
            modern web applications and solves real-world problems.
          </p>

          <br />

          <p>
            I also create developer resources like notes, projects, and courses.
          </p>

          <div className="resume__wrapper">
            <a href="https://drive.google.com/file/d/1RncZCzY-fZBqLkT_UtHpZw1RdW2ajCEv/view" target="_blank" className="btn primary">Resume</a>
          </div>

        </div>

      </div>

      {/* SKILLS */}
      <div className="about__skills">

        <h2 className="section__title">Skills</h2>

        {/* FILTER TABS */}
        <div className="skills__tabs">
          {["All", "Frontend", "Backend", "Languages", "Tools", "Databases"].map(tab => (
            <button
              key={tab}
              className={active === tab ? "active" : ""}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ANIMATED GRID */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="skills__cards"
        >
          {filteredSkills.map((skill, index) => (
            <div className="skill__card" key={index}>
              <div className="icon">{skill.icon}</div>
              <p>{skill.name}</p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* PROFILES */}
      <Profiles />

      {/* TIMELINE */}
<div className="timeline">

  <h2 className="section__title">Experience</h2>

  <div className="timeline__wrapper">

    {/* ITEM 1 */}
    <div className="timeline__item">
      <div className="timeline__dot"></div>

      <div className="timeline__card">
        <h4>Freelance Developer</h4>
        <span>2023 - Present</span>
        <p>
          Built multiple full-stack projects and worked with real clients.
        </p>
      </div>
    </div>

    {/* ITEM 2 */}
    <div className="timeline__item">
      <div className="timeline__dot"></div>

      <div className="timeline__card">
        <h4>Frontend Intern</h4>
        <span>2024</span>
        <p>
          Developed responsive UI using React and modern CSS.
        </p>
      </div>
    </div>

    {/* ITEM 3 */}
    <div className="timeline__item">
      <div className="timeline__dot"></div>

      <div className="timeline__card">
        <h4>Started Coding Journey</h4>
        <span>2022</span>
        <p>
          Learned programming fundamentals and began web development.
        </p>
      </div>
    </div>

  </div>

</div>

    </section>
  )
}

export default About