import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGamepad, FaPlay, FaVideo, FaUserTag } from 'react-icons/fa';
import axios from '../../../core/utils/axios';
import VideoEmbed from '../components/VideoEmbed';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        // Fetch game info
        const gameRes = await axios.get(`/more/games/${id}`);
        setGame(gameRes.data);

        // Fetch streams tied to this specific game
        try {
          const streamsRes = await axios.get(`/more/games/${id}/streams`);
          setArchives(streamsRes.data || []);
        } catch (streamErr) {
          console.error("No streams found or failed to load streams", streamErr);
          setArchives([]);
        }
      } catch (err) {
        console.error("Failed to load game details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  if (loading) {
    return (
      <div className="gd-page-container">
        <div className="gd-skeleton-hero"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="gd-page-container gd-flex-center">
        <div className="gd-empty-state">
          <FaGamepad className="gd-empty-icon" />
          <h2>Game Not Found</h2>
          <p>This game might have been removed or doesn't exist.</p>
          <Link to="/more/gamezone" className="gd-btn-secondary">Return to GameZone</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gd-page-container animated-fade-in">
      
      {/* CINEMATIC HERO SECTION */}
      <div className="gd-hero">
        <div className="gd-hero-bg">
          <img src={game.coverImage || "/default-product.png"} alt={game.name} />
          <div className="gd-hero-overlay"></div>
        </div>
        
        <div className="gd-hero-content">
          <Link to="/more/gamezone" className="gd-back-link">
            <FaArrowLeft /> Back to GameZone
          </Link>
          <h1 className="gd-title">{game.name}</h1>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER (Floats over hero) */}
      <div className="gd-main-wrapper">
        
        {/* FLOATING GLASS INFO CARD */}
        <div className="gd-info-glass">
          <div className="gd-info-header">
            <h2>About The Game</h2>
            <div className="gd-badges">
              {game.username && (
                <span className="gd-badge username-badge">
                  <FaUserTag /> {game.username}
                </span>
              )}
            </div>
          </div>
          
          <p className="gd-description">{game.description}</p>
          
          {game.joinLink && (
            <div className="gd-action-row">
              <a href={game.joinLink} target="_blank" rel="noreferrer" className="gd-btn-primary">
                <FaPlay /> Play Now
              </a>
            </div>
          )}
        </div>

        {/* STREAM ARCHIVES SECTION */}
        <div className="gd-archives-section">
          <div className="gd-section-header">
            <h2><FaVideo /> Stream Archives</h2>
            <span className="gd-count-badge">{archives.length} Videos</span>
          </div>

          {archives.length === 0 ? (
            <div className="gd-empty-state small">
              <FaVideo className="gd-empty-icon small" />
              <p>No recorded streams for this game yet.</p>
            </div>
          ) : (
            <div className="gd-video-grid">
              {archives.map(video => (
                <div key={video._id} className="gd-video-card">
                  <div className="gd-video-embed-wrapper">
                    <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                  </div>
                  <div className="gd-video-info">
                    <h4 title={video.title}>{video.title}</h4>
                    <span>{new Date(video.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GameDetail;