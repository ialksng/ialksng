import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import '../More.css';

const GameZone = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get('/api/more/games');
        setGames(data);
      } catch (err) {
        console.error("Failed to load games", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <div className="more-layout container"><p>Loading GameZone...</p></div>;

  return (
    <div className="more-layout container animated-fade-in">
      <div className="sub-page-header">
        <h1>GameZone</h1>
        <p className="subtitle">Titles I play, my usernames, and specific clips.</p>
      </div>

      <div className="more-grid">
        {games.map(game => (
          <div key={game._id} className="game-card">
            {game.coverImage && (
              <div className="game-cover" style={{ backgroundImage: `url(${game.coverImage})` }}></div>
            )}
            
            <div className="game-content">
              <h3>{game.name}</h3>
              <p className="game-desc">{game.description}</p>
              
              <div className="game-meta">
                <span className="username-label">ID:</span>
                <span className="username-value">{game.username}</span>
              </div>
              
              {game.joinLink && (
                <a href={game.joinLink} target="_blank" rel="noreferrer" className="game-cta">
                  Add me →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameZone;