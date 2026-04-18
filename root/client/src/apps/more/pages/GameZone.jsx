import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";
import GameCard from "../components/GameCard";
import "./GameZone.css";

const GameZone = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get("/more/games");
        setGames(data);
      } catch (err) {
        console.error("Failed to load games", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="gamezone-container">
      <div className="gamezone-hero">
        <div className="gamezone-glow"></div>
        <h1 className="gamezone-title">
          <span className="gamezone-title-highlight">Game</span> Zone
        </h1>
        <p className="gamezone-subtitle">
          Dive into my collection of interactive experiences, mini-games, and fun experiments. 
          Choose a game below and start playing!
        </p>
      </div>

      <div className="gamezone-content">
        {loading ? (
          <div className="gamezone-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="gamezone-skeleton"></div>
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="gamezone-empty">
            <span style={{ fontSize: '3rem', display: 'block' }}>🎮</span>
            <h3>No games found</h3>
            <p>Check back later for new additions!</p>
          </div>
        ) : (
          <div className="gamezone-grid">
            {games.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameZone;