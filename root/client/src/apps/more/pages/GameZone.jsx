import React, { useState, useEffect } from "react";
import axios from "../../../core/utils/axios";

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
    <div className="min-h-screen bg-[var(--bg-primary)] pb-32">

      <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent pt-20 pb-16 px-8 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Game
          </span>{" "}
          Zone
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Dive into my collection of interactive experiences, mini-games, and fun experiments. 
          Choose a game below and start playing!
        </p>
      </div>


      <div className="max-w-7xl mx-auto px-6">
        {loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-gray-800/50 h-80 animate-pulse border border-gray-700/50"></div>
            ))}
          </div>
        ) : games.length === 0 ? (

          <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-gray-700/50">
            <span className="text-4xl mb-4 block">🎮</span>
            <h3 className="text-2xl font-bold text-gray-300">No games found</h3>
            <p className="text-gray-500 mt-2">Check back later for new additions!</p>
          </div>
        ) : (
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <a
                href={game.link}
                target="_blank"
                rel="noopener noreferrer"
                key={game._id}
                className="group relative flex flex-col bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
              >

                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                  <img
                    src={game.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      {game.category || "Game"}
                    </span>
                  </div>
                </div>

                <div className="relative p-6 flex-grow flex flex-col z-20 bg-gray-900">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                    {game.description}
                  </p>

                  <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-white/5 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-300 border border-white/10 group-hover:border-purple-500">
                    Play Now
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameZone;