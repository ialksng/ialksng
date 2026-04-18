import React, { useEffect, useState } from 'react';
import MoreCard from './components/MoreCard';
import axios from '../../core/utils/axios';
import './More.css';

const More = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const { data } = await axios.get('/api/more/streams/live');
        if (data && data.status === 'live') {
          setIsLive(true);
        }
      } catch (err) {
        console.error("Failed to fetch live status");
      }
    };
    checkLiveStatus();
  }, []);

  return (
    <div className="more-layout container">
      <div className="sub-page-header">
        <h1>More</h1>
        <p>Beyond the code. Games, gear, and life updates.</p>
      </div>
      
      <div className="more-grid">
        <MoreCard 
          title="GameZone" 
          description="Games I play, usernames, and stream archives."
          to="/more/gamezone"
          icon="🎮"
        />
        <MoreCard 
          title="Live" 
          description={isLive ? "I am currently live! Come say hi." : "Watch past streams and upcoming schedules."}
          to="/more/live"
          icon="🔴"
          badge={isLive ? "LIVE" : null}
        />
        <MoreCard 
          title="Products & Gear" 
          description="A curated list of tools, tech, and software I use daily."
          to="/more/products"
          icon="⚡"
        />
        <MoreCard 
          title="Life & Fitness" 
          description="Personal updates, fitness tracking, and quick tips."
          to="/more/life"
          icon="🌿"
        />
      </div>
    </div>
  );
};

export default More;