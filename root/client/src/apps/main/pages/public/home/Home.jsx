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
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get('/home'); 
        setHomeData(res.data);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <Loader />;
  if (!homeData) return <div className="home__wrapper"><p style={{color:'white', textAlign:'center', marginTop:'50px'}}>Failed to load Home Page data.</p></div>;

  return (
    <div className="home__wrapper">
      
      <Hero 
        title={homeData.heroTitle} subtitle={homeData.heroSubtitle}
        btn1Text={homeData.heroPrimaryButtonText} btn1Link={homeData.heroPrimaryButtonLink}
        btn2Text={homeData.heroSecondaryButtonText} btn2Link={homeData.heroSecondaryButtonLink}
      />
      
      <OfferCards cards={homeData.offerCards || []} /> 
      
      <FeaturedProjects heading={homeData.portfolioHeading} /> 
      
      <ServicesPreview heading={homeData.servicesHeading} services={homeData.services || []} />
      
      <StorePreview heading={homeData.storeHeading} /> 
      
      <Testimonials heading={homeData.testimonialsHeading} /> 
      
      <AboutPreview />
      
      <Updates heading={homeData.blogHeading} /> 
      
      <FinalCTA title={homeData.ctaTitle} btnText={homeData.ctaButtonText} btnLink={homeData.ctaButtonLink} />
      
      <FunExtras stats={homeData.funExtras || []} />
      
    </div>
  );
}

export default Home;