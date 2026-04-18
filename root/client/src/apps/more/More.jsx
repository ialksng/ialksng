import React, { useState, useEffect } from 'react';
import MoreCard from './components/MoreCard';
import axios from '../../core/utils/axios';
import './More.css';

const More = () => {
  const [liveData, setLiveData] = useState({ isLive: false, title: "" });

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const { data } = await axios.get('/more/streams/live');
        if (data && data.status === 'live') {
          setLiveData({ isLive: true, title: data.title });
        }
      } catch (err) {
        console.error("Failed to fetch live status");
      }
    };
    checkLiveStatus();
  }, []);

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
            <p className="dynamic-text">
              Minecraft <span className="dot-separator">•</span> Valorant <span className="dot-separator">•</span> Chess
            </p>
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
              <span className="label">Curated Setup:</span>
              <p className="dynamic-text highlight-text">Tools I use daily</p>
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
              <span className="update-dot"></span> Personal updates & progress
            </p>
          }
          cta="View Updates"
        />
      </div>
    </div>
  );
};

export default More;