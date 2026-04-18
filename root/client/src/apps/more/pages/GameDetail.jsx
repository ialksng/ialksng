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

  if (loading) return <div className="gamezone-container pt-32 text-center text-gray-400">Loading game...</div>;
  if (!game) return <div className="gamezone-container pt-32 text-center text-gray-400">Game not found.</div>;

  return (
    <div className="gamezone-container min-h-screen bg-gray-900 pb-32">
      <div className="relative h-80 md:h-[400px] w-full border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <img 
          src={game.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"} 
          alt={game.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 p-8 max-w-7xl mx-auto">
          <Link to="/more/gamezone" className="text-purple-400 hover:text-purple-300 text-sm font-bold mb-4 inline-block">
            ← Back to Game Zone
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase mb-2 block">
                {game.category || 'Game'}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2">{game.name}</h1>
              {game.username && (
                <p className="text-gray-300 text-lg flex items-center gap-2">
                  <span className="text-gray-500">My ID:</span> 
                  <span className="bg-gray-800 px-3 py-1 rounded border border-gray-700 font-mono text-cyan-300">
                    {game.username}
                  </span>
                </p>
              )}
            </div>
            {game.joinLink && (
              <a 
                href={game.joinLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-purple-400/50"
              >
                Play / Add Friend
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 md:p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">About the Game</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{game.description}</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Video Archives</h2>
          <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-sm font-bold border border-gray-700">
            {archives.length} Videos
          </span>
        </div>

        {archives.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-gray-700/50">
            <span className="text-4xl mb-4 block">📼</span>
            <h3 className="text-2xl font-bold text-gray-300">No archives yet</h3>
            <p className="text-gray-500 mt-2">Check back later for recorded streams of {game.name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {archives.map(video => (
              <div key={video._id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded uppercase">
                      {video.platform}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{video.title}</h4>
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