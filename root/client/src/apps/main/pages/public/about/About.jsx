import React from 'react';

import AboutHero from './components/AboutHero.jsx';
import ProfessionalSummary from './components/ProfessionalSummary.jsx';
import ResumeSnapshot from './components/ResumeSnapshot';
import SkillsStack from './components/SkillsStack.jsx';
import Experience from './components/Experience';
import CodingProfiles from './components/CodingProfiles';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Achievements from './components/Achievements';
import FinalCTA from './components/FinalCTA';

import './About.css';

function About() {
  return (
    <div className="about__wrapper">
      <AboutHero />
      <ProfessionalSummary />
      <ResumeSnapshot />
      <SkillsStack />
      <Experience />
      <CodingProfiles />
      <Certifications />
      <Education />
      <Achievements />
      <FinalCTA />
    </div>
  );
}

export default About;