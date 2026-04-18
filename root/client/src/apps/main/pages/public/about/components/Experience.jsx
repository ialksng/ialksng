import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

import './Experience.css';

export default function Experience() {
  const experiences = [
    {
      role: "Web Developer",
      company: "Coincent.ai",
      duration: "Jun 2024 - Aug 2024",
      description: [
        "Built and maintained responsive web applications using React.js, Node.js, and MongoDB.",
        "Enhanced UI/UX and optimized application performance for faster load times and better usability.",
        "Designed and integrated RESTful APIs, implementing secure backend logic and data handling.",
        "Collaborated in an Agile environment using Git for version control and Render for deployment."
      ],
      techStack: ["React.js", "Node.js", "MongoDB", "Firebase"]
    },
    {
      role: "Data Analyst",
      company: "Modulation Digital Private Limited",
      duration: "May 2025 - Jul 2025",
      description: [
        "Analyzed and processed large datasets using Python (Pandas, NumPy) and SQL, performing data wrangling, aggregation, and exploratory data analysis (EDA).",
        "Built interactive Power BI dashboards with optimized data models, DAX measures, and visualizations to track key business metrics.",
        "Automated data cleaning, transformation, and reporting pipelines using Python scripts, reducing manual effort and improving data consistency.",
        "Applied statistical analysis and trend identification to derive actionable insights supporting data-driven decision-making."
      ],
      techStack: ["Microsoft Excel", "MySQL", "Microsoft Power BI", "Python"]
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