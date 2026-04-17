import React from 'react';
import { FaGraduationCap, FaUniversity, FaCalendarAlt } from 'react-icons/fa';

import './Education.module.css';

export default function Education() {
  const educationData = [
    {
      degree: "B.Tech in Computer Science Engineering (CSE)",
      institute: "Your College/University Name, Greater Noida", 
      duration: "2023 - 2027 (Expected)",
      score: "9.0 CGPA",
      status: "3rd Year Student",
      coursework: [
        "Data Structures & Algorithms", 
        "Object-Oriented Programming (Java)", 
        "Database Management Systems (DBMS)", 
        "Operating Systems", 
        "Computer Networks",
        "Theory of Computation" 
      ]
    },
    {
      degree: "Higher Secondary (Class XII)",
      institute: "Your High School Name",
      duration: "Completed in 2023",
      score: "XX% / XX CGPA",
      status: "Science Stream (PCM)",
      coursework: [
        "Physics", 
        "Chemistry", 
        "Mathematics", 
        "Computer Science"
      ]
    }
  ];

  return (
    <section className="about__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header">
          <h2>Education & Academics</h2>
          <p>My academic background and core computer science foundations.</p>
        </div>

        <div className="education__container">
          {educationData.map((edu, index) => (
            <div className="education__card" key={index}>
              
              <div className="education__header">
                
                <div className="education__title-group">
                  <div className="education__icon">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <h3 className="education__degree">{edu.degree}</h3>
                    <div className="education__institute">
                      <FaUniversity style={{ color: "var(--text-muted)" }}/> 
                      {edu.institute}
                    </div>
                  </div>
                </div>

                <div className="education__meta">
                  <div className="education__score">{edu.score}</div>
                  <div className="education__duration">
                    <FaCalendarAlt /> {edu.duration} • {edu.status}
                  </div>
                </div>

              </div>

              <div className="education__body">
                <h4>Core Coursework & Subjects</h4>
                <div className="education__coursework">
                  {edu.coursework.map((course, idx) => (
                    <span key={idx}>{course}</span>
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