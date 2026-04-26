import React from 'react';

// Import the new banner
import NotificationBanner from '../../../../../core/components/NotificationBanner'; 

import Hero from './components/Hero';
import OfferCards from './components/OfferCards';
import FeaturedProjects from './components/FeaturedProjects';
import ServicesPreview from './components/ServicesPreview';
import StorePreview from './components/StorePreview';
import Testimonials from './components/Testimonials';
import AboutPreview from './components/AboutPreview';
import Updates from './components/Updates';
import FinalCTA from './components/FinalCTA';

import './Home.css';

function Home() {
  return (
    <div className="home__wrapper">
      {/* Banner goes right here, so it only shows on the Home route */}
      <NotificationBanner />
      
      <Hero />
      <OfferCards />
      <AboutPreview />
      <FeaturedProjects />
      <ServicesPreview />
      <StorePreview />
      <Testimonials />
      <Updates />
      <FinalCTA />
    </div>
  );
}

export default Home;