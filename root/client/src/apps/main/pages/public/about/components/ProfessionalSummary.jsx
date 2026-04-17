import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

import './ProfessionalSummary.css';

export default function ProfessionalSummary() {
  return (
    <section className="about__section">
      <div className="container">
        
        <div className="section__header">
          <h2>Who I Am</h2>
          <p>My journey, mindset, and what I bring to the table.</p>
        </div>

        <div className="summary__container">
          <div className="summary__content">
            <p>
              I am a 3rd-year <strong>Computer Science Engineering</strong> student based in Greater Noida, India. 
              My journey in tech is driven by a deep curiosity for how complex systems work under the hood. 
              I specialize in engineering scalable, high-performance web applications using the <strong>MERN stack and Spring Boot</strong>, 
              always focusing on writing clean, maintainable, and highly optimized code.
            </p>

            <div className="summary__mission">
              "I believe great software lives at the intersection of robust algorithmic logic and seamless user experience. 
              My goal is to build digital solutions that don't just work, but <span>scale efficiently</span>."
            </div>

            <p>
              Beyond building applications, I am an avid competitive programmer. With a <strong>LeetCode rating of over 1800</strong> and a 
              <strong> 2-Star rating on CodeChef</strong>, I thrive on tackling complex algorithmic challenges. This problem-solving mindset 
              directly translates into my development work, allowing me to design optimized database schemas and efficient API architectures.
            </p>

            <p>
              Currently, I am expanding my expertise into <strong>DevOps, Data Science, and open-source LLMs</strong> (experimenting locally with Mistral and Llama via Ollama). 
              Alongside my freelance work and personal projects like BuddyBot and Smartsphaere, I am actively preparing for the GATE CS/IT exam and gearing up to contribute to Google Summer of Code (GSoC).
            </p>
          </div>

          <div className="summary__opportunities">
            <h3>What I'm Looking For</h3>
            <ul className="opportunities__list">
              <li><FaCheckCircle /> Software Engineering Internships</li>
              <li><FaCheckCircle /> Full-Stack Freelance Projects</li>
              <li><FaCheckCircle /> Open Source Collaborations</li>
              <li><FaCheckCircle /> Technical Writing / Developer Advocacy</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}