import React, { useState, useEffect } from 'react';
import axios from '../../../../../core/utils/axios';
import Loader from '../../../../../core/components/Loader';

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axios.get('/about'); 
        setData(res.data);
      } catch (err) {
        console.error("Failed to load about data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="about__wrapper"><p style={{color:'white', textAlign:'center', marginTop:'50px'}}>Failed to load data.</p></div>;

  return (
    <div className="about__wrapper">
      <AboutHero 
        name={data.name} 
        role={data.role} 
        imageUrl={data.imageUrl} 
        stats={data.stats || []} 
      />
      <ProfessionalSummary paragraphs={data.paragraphs || []} />
      <ResumeSnapshot link={data.resumeLink} />
      <SkillsStack skills={data.skills || []} />
      <Experience experiences={data.experiences || []} />
      <CodingProfiles profiles={data.profiles || []} />
      <Certifications /> 
      <Education education={data.education || []} />
      <Achievements achievements={data.achievements || []} />
      <FinalCTA text={data.ctaText} link={data.ctaLink} />
    </div>
  );
}

export default About;