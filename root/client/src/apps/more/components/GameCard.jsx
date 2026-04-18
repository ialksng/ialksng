import React from 'react';

const GameCard = ({ game }) => {
  return (
    <a
      href={game.joinLink || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
    >
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
        
        {game.username && (
          <p style={{ color: '#67e8f9', fontSize: '0.8rem', marginBottom: '1rem' }}>
            ID: {game.username}
          </p>
        )}
        
        <div className="game-card-btn">
          Play / Add Me
          <svg className="game-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default GameCard;