import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
        const gameRes = await axios.get(`/more/games/${id}`);
        setGame(gameRes.data);

        const streamsRes = await axios.get(`/more/games/${id}/streams`);
        setArchives(streamsRes.data);
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
      <div className="gd-loading">
        <div className="gd-spinner"></div>
        <p>Loading Game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="gd-empty">
        <h2>Game Not Found</h2>
        <Link to="/more/gamezone">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="gd-container">

      {/* HERO */}
      <div className="gd-hero">
        <img
          src={game.coverImage}
          alt={game.name}
          className="gd-hero-img"
        />

        <div className="gd-overlay"></div>

        <div className="gd-hero-content">
          <Link to="/more/gamezone" className="gd-back">
            ← Back
          </Link>

          <h1>{game.name}</h1>

          {game.username && (
            <div className="gd-username">
              ID: {game.username}
            </div>
          )}

          {game.joinLink && (
            <a
              href={game.joinLink}
              target="_blank"
              rel="noreferrer"
              className="gd-btn"
            >
              Play Now
            </a>
          )}
        </div>
      </div>

      {/* ABOUT */}
      <div className="gd-section">
        <h2>About</h2>
        <p>{game.description}</p>
      </div>

      {/* ARCHIVES */}
      <div className="gd-section">
        <div className="gd-section-header">
          <h2>Stream Archives</h2>
          <span>{archives.length} Videos</span>
        </div>

        {archives.length === 0 ? (
          <div className="gd-empty">
            <p>No videos yet</p>
          </div>
        ) : (
          <div className="gd-grid">
            {archives.map(video => (
              <div key={video._id} className="gd-card">
                <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                <div className="gd-card-body">
                  <h4>{video.title}</h4>
                  <span>
                    {new Date(video.createdAt).toDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default GameDetail;