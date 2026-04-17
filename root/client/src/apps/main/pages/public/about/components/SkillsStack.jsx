import React, { useState } from 'react';
import {
  FaCode,
  FaServer,
  FaDatabase,
  FaTools,
  FaLaptopCode,
  FaBrain,
  FaCss3Alt,
  FaJava,
  FaPython
} from 'react-icons/fa';
import {
  SiCplusplus, SiJavascript, SiReact,
  SiHtml5, SiTailwindcss, SiNodedotjs,
  SiExpress, SiSpringboot, SiMongodb,
  SiMysql, SiPostgresql, SiGit,
  SiDocker, SiLinux, SiPostman
} from 'react-icons/si';

import './SkillsStack.css';

export default function SkillsStack() {
  const [activeFilter, setActiveFilter] = useState("All");

  const skillsData = [
    {
      category: "Languages",
      icon: <FaCode />,
      skills: [
        { name: "Java", icon: <FaJava /> },
        { name: "C++ (CP Focus)", icon: <SiCplusplus /> },
        { name: "JavaScript", icon: <SiJavascript /> },
        { name: "Python", icon: <FaPython /> }
      ]
    },
    {
      category: "Frontend",
      icon: <FaLaptopCode />,
      skills: [
        { name: "React.js", icon: <SiReact /> },
        { name: "HTML5", icon: <SiHtml5 /> },
        { name: "CSS3", icon: <FaCss3Alt /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss /> }
      ]
    },
    {
      category: "Backend",
      icon: <FaServer />,
      skills: [
        { name: "Node.js", icon: <SiNodedotjs /> },
        { name: "Express.js", icon: <SiExpress /> },
        { name: "Spring Boot", icon: <SiSpringboot /> },
        { name: "Java Collections", icon: <FaJava /> },
        { name: "RESTful APIs", icon: <FaServer /> }
      ]
    },
    {
      category: "Databases",
      icon: <FaDatabase />,
      skills: [
        { name: "MongoDB", icon: <SiMongodb /> },
        { name: "MySQL", icon: <SiMysql /> },
        { name: "PostgreSQL", icon: <SiPostgresql /> }
      ]
    },
    {
      category: "DevOps & Tools",
      icon: <FaTools />,
      skills: [
        { name: "Git & GitHub", icon: <SiGit /> },
        { name: "Docker", icon: <SiDocker /> },
        { name: "Linux", icon: <SiLinux /> },
        { name: "Postman", icon: <SiPostman /> },
        { name: "CI/CD", icon: <FaTools /> }
      ]
    },
    {
      category: "AI & Data",
      icon: <FaBrain />,
      skills: [
        { name: "Data Analysis", icon: <FaBrain /> },
        { name: "Ollama", icon: <FaBrain /> },
        { name: "Mistral", icon: <FaBrain /> },
        { name: "Llama", icon: <FaBrain /> }
      ]
    }
  ];

const filters = ["All", ...skillsData.map(item => item.category)];

  const filteredSkills = activeFilter === "All" 
    ? skillsData 
    : skillsData.filter(item => item.category === activeFilter);

  return (
    <section className="about__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section__header">
          <h2>Technical Arsenal</h2>
          <p>The tools, languages, and frameworks I use to build robust digital solutions.</p>
        </div>

        <div className="skills__controls">
          <div className="skills__filter-group">
            <span className="skills__filter-label">Filter by Category:</span>
            <select 
              className="skills__filter-select"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {filters.map((filter, index) => (
                <option key={index} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="skills__container">
          {filteredSkills.map((category, index) => (
            <div className="skill__category-card" key={index}>
              <div className="skill__category-header">
                <div className="skill__category-icon">
                  {category.icon}
                </div>
                <h3 className="skill__category-title">{category.category}</h3>
              </div>
              <div className="skill__pills">
                {category.skills.map((skill, idx) => (
                  <span className="skill__pill" key={idx}>
                    <span className="pill__icon">{skill.icon}</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}