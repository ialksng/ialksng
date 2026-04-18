import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../../core/utils/axios';
import VideoEmbed from '../components/VideoEmbed';
import './GameZone.css';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);

        const [gameRes, streamsRes] = await Promise.all([
          axios.get(`/more/games/${id}`),
          axios.get(`/more/games/${id}/streams`)
        ]);

        setGame(gameRes.data);
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
      <div className="gamezone-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-400 font-mono uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="gamezone-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-gray-900/50 p-10 rounded-2xl border border-gray-800">
          <span className="text-5xl block mb-3">⚠️</span>
          <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
          <Link to="/more/gamezone" className="text-cyan-400 hover:underline">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gamezone-container pb-24">

      {/* HERO */}
      <div className="relative h-[400px] md:h-[520px] w-full overflow-hidden">
        <img 
          src={game.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"} 
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          style={{ filter: 'brightness(0.7)' }}
        />

        <div className="absolute inset-0 game-detail-hero-overlay"></div>

        <div className="absolute bottom-0 w-full px-6 pb-10 z-10">
          <div className="max-w-6xl mx-auto">

            <Link
              to="/more/gamezone"
              className="text-sm text-gray-400 hover:text-cyan-400 mb-4 inline-block"
            >
              ← Back
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 game-detail-title-shadow">
              {game.name}
            </h1>

            <p className="text-gray-300 max-w-xl">
              {game.description || "No description available"}
            </p>

            {game.joinLink && (
              <a
                href={game.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
              >
                Play / Connect
              </a>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-10">

        {/* ABOUT */}
        <div className="glass-panel p-6 rounded-xl mb-12">
          <h2 className="text-xl font-semibold text-white mb-3">
            About
          </h2>
          <p className="text-gray-300">
            {game.description || "No details available"}
          </p>
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Stream Archives
          </h2>
          <span className="text-sm text-gray-400">
            {archives.length} videos
          </span>
        </div>

        {/* EMPTY */}
        {archives.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded-xl">
            <h3 className="text-lg text-gray-400">No videos yet</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {archives.map(video => (
              <div key={video._id} className="video-archive-card group">

                <VideoEmbed
                  embedUrl={video.embedUrl}
                  title={video.title}
                />

                <div className="p-4">
                  <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition">
                    {video.title}
                  </h4>

                  <p className="text-sm text-gray-400 mt-1">
                    {video.platform || 'Video'} •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
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