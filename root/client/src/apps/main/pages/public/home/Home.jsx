import React, { useState, useEffect } from 'react';
import axios from '../../../../../core/utils/axios';
import Loader from '../../../../../core/components/Loader';

import Hero from './components/Hero';
import OfferCards from './components/OfferCards';
import FeaturedProjects from './components/FeaturedProjects';
import ServicesPreview from './components/ServicesPreview';
import StorePreview from './components/StorePreview';
import Testimonials from './components/Testimonials';
import AboutPreview from './components/AboutPreview';
import Updates from './components/Updates';
import FinalCTA from './components/FinalCTA';
import FunExtras from './components/FunExtras';

import './Home.css';

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get('/home'); 
        setData(res.data);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="home__wrapper"><p style={{color:'white', textAlign:'center', marginTop:'50px'}}>Failed to load data.</p></div>;

  return (
    <div className="home__wrapper">
      <Hero 
        title={data.heroTitle} 
        subtitle={data.heroSubtitle}
        btn1Text={data.heroPrimaryButtonText} 
        btn1Link={data.heroPrimaryButtonLink}
        btn2Text={data.heroSecondaryButtonText} 
        btn2Link={data.heroSecondaryButtonLink}
      />
      
      <OfferCards /> 
      <FeaturedProjects /> 
      
      <ServicesPreview 
        heading={data.servicesHeading} 
        services={data.services || []} 
      />
      
      <StorePreview /> 
      <Testimonials /> 
      <AboutPreview />
      <Updates /> 
      
      <FinalCTA 
        title={data.ctaTitle} 
        btnText={data.ctaButtonText} 
        btnLink={data.ctaButtonLink} 
      />
      
      <FunExtras stats={data.funExtras || []} />
    </div>
  );
}

export default Home;