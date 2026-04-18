import React, { useState, useEffect } from 'react';
import MoreCard from './components/MoreCard';
import './More.css';

const More = () => {
  const [liveData, setLiveData] = useState({ isLive: true, title: "Building the new portfolio 🚀" });

  return (
    <div className="more-layout container">
      <div className="section-header animated-fade-in">
        <h1>More</h1>
        <p className="subtitle">Not everything I build is code.</p>
      </div>
      
      <div className="more-grid">
        <MoreCard 
          title="Live" 
          icon="🔴"
          to="/more/live"
          isLive={liveData.isLive}
          featured={true}
          delayIndex={1}
          dynamicContent={
            <p className="dynamic-text featured-text">
              {liveData.isLive ? liveData.title : "Catching some sleep. Next stream soon."}
            </p>
          }
          cta={liveData.isLive ? "Join Stream" : "View Archive"}
        />

        <MoreCard 
          title="GameZone" 
          icon="🎮"
          to="/more/gamezone"
          delayIndex={2}
          dynamicContent={
            <p className="dynamic-text">Minecraft <span className="dot-separator">•</span> Valorant <span className="dot-separator">•</span> Chess</p>
          }
          cta="Explore Games"
        />

        <MoreCard 
          title="Products & Gear" 
          icon="⚡"
          to="/more/products"
          delayIndex={3}
          dynamicContent={
            <div className="gear-preview">
              <span className="label">Currently testing:</span>
              <p className="dynamic-text highlight-text">Keychron Q1 Pro</p>
            </div>
          }
          cta="See Setup"
        />

        <MoreCard 
          title="Life & Fitness" 
          icon="🌿"
          to="/more/life"
          delayIndex={4}
          dynamicContent={
            <p className="dynamic-text">
              <span className="update-dot"></span> Gym Day 12 • Staying consistent
            </p>
          }
          cta="View Updates"
        />
      </div>
    </div>
  );
};

export default More;