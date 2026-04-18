import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <Link to={`/more/gamezone/${game._id}`} className="game-card">
      <div className="game-card-img-wrapper">
        <div className="game-card-gradient"></div>
        <img
          src={game.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"}
          alt={game.name}
          className="game-card-img"
        />
        <div className="game-card-badge">
          {game.category || "Game"}
        </div>
      </div>

      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-desc">{game.description}</p>
        
        <div className="game-card-btn">
          View Details & Archives
          <svg className="game-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;