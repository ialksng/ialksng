import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitch, FaGamepad, FaLaptopCode, FaLeaf, FaArrowRight, FaCode, FaHeadphones } from 'react-icons/fa';
import axios from '../../core/utils/axios';
import './More.css';

const More = () => {
  const [liveData, setLiveData] = useState(null);
  const [latestLife, setLatestLife] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streamRes, lifeRes] = await Promise.all([
          axios.get('/more/streams/live'),
          axios.get('/more/life?limit=1')
        ]);
        if (streamRes.data) setLiveData(streamRes.data);
        if (lifeRes.data && lifeRes.data.length > 0) setLatestLife(lifeRes.data[0]);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  // Flashlight hover effect logic
  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.getElementsByClassName("bento-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div className="more-dashboard container">
      
      <div className="more-hero animated-fade-in">
        <div className="hero-glow"></div>
        <h1>Explore My Universe</h1>
        <p className="subtitle">Life outside the IDE. Catch me live, explore my setup, or challenge me to a game.</p>
        
        <div className="quick-stats">
          <span className="stat-pill"><FaCode /> 10k+ Lines Written</span>
          <span className="stat-pill"><FaHeadphones /> Lo-Fi Beats</span>
        </div>
      </div>
      
      <div className="bento-grid" ref={gridRef} onMouseMove={handleMouseMove}>
        
        {/* CARD 1: Live Stream (Large) */}
        <Link to="/more/live" className="bento-card card-live animated-fade-in delay-1">
          <div className="card-glow"></div>
          <div className="bento-content">
            <div className="bento-header">
              <span className={`live-badge ${liveData?.status === 'live' ? 'pulsing' : 'offline'}`}>
                <div className="dot"></div>
                {liveData?.status === 'live' ? 'LIVE NOW' : 'OFFLINE'}
              </span>
              <div className="icon-wrapper twitch-icon"><FaTwitch /></div>
            </div>
            
            <div className="bento-body live-body">
              <h2>{liveData?.status === 'live' ? 'Streaming Now' : 'Catch the VODs'}</h2>
              <p className="stream-title">
                {liveData?.title || "Currently taking a break. Exploring new tech, or grinding ranked. Check out past broadcasts."}
              </p>
            </div>
            
            <div className="bento-footer">
              <span className="action-text">Enter Stream <FaArrowRight /></span>
              <div className="stream-waves">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </Link>

        {/* CARD 2: GameZone (Tall) */}
        <Link to="/more/gamezone" className="bento-card card-games animated-fade-in delay-2">
          <div className="card-glow"></div>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper games-icon"><FaGamepad /></div>
            </div>
            
            <div className="bento-body games-body">
              <h2>GameZone</h2>
              <p>Clash of Clans, Valorant, Minecraft, and my favorite gaming moments.</p>
              
              <div className="interactive-stats">
                <div className="stat-row">
                  <span className="stat-label">Valorant Rank</span>
                  <span className="stat-value text-red">Immortal</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Clash TH</span>
                  <span className="stat-value text-gold">Level 15</span>
                </div>
              </div>
            </div>
            
            <div className="bento-footer">
              <span className="action-text">View Stats <FaArrowRight /></span>
            </div>
          </div>
        </Link>

        {/* CARD 3: Life Updates */}
        <Link to="/more/life" className="bento-card card-life animated-fade-in delay-3">
          <div className="card-glow"></div>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper life-icon"><FaLeaf /></div>
              <span className="tiny-label">Social Feed</span>
            </div>
            
            <div className="bento-body">
              <h2>Dev Log</h2>
              <div className="latest-update-snippet">
                {latestLife ? (
                  <>
                    <span className="snippet-date">{new Date(latestLife.createdAt).toLocaleDateString()}</span>
                    <p>"{latestLife.title}"</p>
                  </>
                ) : (
                  <p>Daily updates, fitness tracking, and random thoughts directly from my desk.</p>
                )}
              </div>
            </div>
            
            <div className="bento-footer">
              <span className="action-text">Read Journal <FaArrowRight /></span>
            </div>
          </div>
        </Link>

        {/* CARD 4: Products & Gear */}
        <Link to="/more/products" className="bento-card card-gear animated-fade-in delay-4">
          <div className="card-glow"></div>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper gear-icon"><FaLaptopCode /></div>
              <span className="tiny-label">Workspace</span>
            </div>
            
            <div className="bento-body">
              <h2>My Setup</h2>
              <p>The tech, tools, and hardware I use to build every day.</p>
            </div>
            
            <div className="bento-footer">
              <span className="action-text">See Inventory <FaArrowRight /></span>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default More;