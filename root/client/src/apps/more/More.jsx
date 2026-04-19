import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitch, FaGamepad, FaLaptopCode, FaLeaf, FaArrowRight } from 'react-icons/fa';
import axios from '../../core/utils/axios';
import './More.css';

const More = () => {
  const [liveData, setLiveData] = useState(null);
  const [latestLife, setLatestLife] = useState(null);

  useEffect(() => {
    // Fetch live status and the latest life update to make the dashboard dynamic
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

  return (
    <div className="more-dashboard container">
      <div className="section-header animated-fade-in">
        <h1>Explore More</h1>
        <p className="subtitle">Life outside of the IDE. Streams, games, gear, and daily logs.</p>
      </div>
      
      <div className="bento-grid">
        
        {/* CARD 1: Live Stream (Large) */}
        <Link to="/more/live" className="bento-card card-live animated-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bento-bg-gradient"></div>
          <div className="bento-content">
            <div className="bento-header">
              <span className={`live-badge ${liveData?.status === 'live' ? 'pulsing' : ''}`}>
                <div className="dot"></div>
                {liveData?.status === 'live' ? 'LIVE NOW' : 'OFFLINE'}
              </span>
              <FaTwitch className="bento-icon" />
            </div>
            <div className="bento-body">
              <h2>{liveData?.status === 'live' ? 'Watch the Stream' : 'Catch the VODs'}</h2>
              <p>{liveData?.title || "Currently taking a break. Check out my past broadcasts."}</p>
            </div>
            <div className="bento-footer">
              Go to Streams <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* CARD 2: GameZone (Tall) */}
        <Link to="/more/gamezone" className="bento-card card-games animated-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper games-icon"><FaGamepad /></div>
            </div>
            <div className="bento-body">
              <h2>GameZone</h2>
              <p>Clash of Clans, Valorant, Minecraft, and my favorite gaming moments.</p>
              <div className="games-preview">
                <span>🏆 Level 145</span>
                <span>⚔️ Immortal</span>
              </div>
            </div>
            <div className="bento-footer">
              Enter Zone <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* CARD 3: Life Updates (Wide) */}
        <Link to="/more/life" className="bento-card card-life animated-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper life-icon"><FaLeaf /></div>
              <span className="tiny-label">Social Feed</span>
            </div>
            <div className="bento-body">
              <h2>Dev Log & Life</h2>
              <div className="latest-update-snippet">
                {latestLife ? (
                  <>
                    <span className="snippet-date">{new Date(latestLife.createdAt).toLocaleDateString()}</span>
                    <p>"{latestLife.title}"</p>
                  </>
                ) : (
                  <p>Daily updates, fitness tracking, and random thoughts.</p>
                )}
              </div>
            </div>
            <div className="bento-footer">
              View Feed <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* CARD 4: Products & Gear */}
        <Link to="/more/products" className="bento-card card-gear animated-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bento-content">
            <div className="bento-header">
              <div className="icon-wrapper gear-icon"><FaLaptopCode /></div>
            </div>
            <div className="bento-body">
              <h2>Setup & Gear</h2>
              <p>The tech, tools, and hardware I use to build every day.</p>
            </div>
            <div className="bento-footer">
              See Inventory <FaArrowRight />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default More;