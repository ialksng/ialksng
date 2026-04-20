import React, { useState, useEffect } from 'react';
import VideoEmbed from '../components/VideoEmbed';
import axios from '../../../core/utils/axios';
import './Live.css';

const Live = () => {
  const [currentStream, setCurrentStream] = useState(null);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const liveRes = await axios.get('/more/streams/live');
        setCurrentStream(liveRes.data);

        const allRes = await axios.get('/more/streams/all');

        const filteredArchives = allRes.data.filter(
          (video) => video._id !== liveRes.data?._id
        );
        setArchives(filteredArchives);
      } catch (err) {
        console.error("Failed to load streams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamData();
  }, []);

  if (loading) {
    return (
      <div className="live-container">
        <div className="live-skeleton-hero"></div>
      </div>
    );
  }

  return (
    <div className="live-container animated-fade-in">
      <div className="live-hero">
        <div className="live-glow"></div>
        <h1 className="live-title">
          <span className="live-title-highlight">Stream</span> Central
        </h1>
        <p className="live-subtitle">
          {currentStream?.status === 'live' 
            ? "I'm currently live! Jump in the chat and say hi." 
            : "Currently offline. Check out the latest VODs and highlights below."}
        </p>
      </div>

      {currentStream && (
        <div className="live-player-wrapper">
          <div className="live-player-glass">
            <div className="player-header">
              <div className="stream-tags">
                <span className={`status-badge ${currentStream.status === 'live' ? 'live-now' : 'archived'}`}>
                  <span className="dot"></span>
                  {currentStream.status === 'live' ? 'LIVE NOW' : 'ARCHIVED'}
                </span>
                <span className="tag platform-tag">{currentStream.platform}</span>
                <span className="tag category-tag">
                  {currentStream.category === 'gaming' ? '🎮 Gaming' : '💬 General'}
                </span>
              </div>
            </div>
            
            <div className="video-container">
              <VideoEmbed embedUrl={currentStream.embedUrl} title={currentStream.title} />
            </div>

            <div className="player-info">
              <h2>{currentStream.title}</h2>
            </div>
          </div>
        </div>
      )}

      {archives.length > 0 && (
        <div className="archive-section">
          <h3 className="section-heading">Past Broadcasts</h3>
          <div className="archive-grid">
            {archives.map((video) => (
              <div
                key={video._id}
                className="archive-card"
                onClick={() => {
                  setCurrentStream(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="archive-thumbnail">
                  <div className="archive-play-overlay">▶ Play VOD</div>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} />
                  ) : (
                    <div className="thumbnail-placeholder"></div>
                  )}
                </div>
                <div className="archive-info">
                  <h4>{video.title}</h4>
                  <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;