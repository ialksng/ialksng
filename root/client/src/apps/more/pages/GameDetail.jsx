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

  if (loading) return (
    <div className="gamezone-container flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-purple-400 font-mono tracking-widest uppercase">Loading Asset...</p>
      </div>
    </div>
  );

  if (!game) return (
    <div className="gamezone-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center bg-gray-900/50 p-10 rounded-2xl border border-gray-800">
        <span className="text-6xl block mb-4">⚠️</span>
        <h2 className="text-2xl font-bold text-white mb-2">Game Not Found</h2>
        <Link to="/more/gamezone" className="text-cyan-400 hover:text-cyan-300 underline">Return to Base</Link>
      </div>
    </div>
  );

  return (
    <div className="gamezone-container min-h-screen bg-[#0f172a] pb-32">
      <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={game.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"} 
            alt={game.name} 
            className="w-full h-full object-cover opacity-60 scale-105"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0f172a]/40 via-transparent to-[#0f172a]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/more/gamezone" 
              className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-cyan-400 transition-colors mb-6 uppercase tracking-wider group"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to GameZone
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-900/40 border border-cyan-500/30 backdrop-blur-md">
                  <span className="text-cyan-400 font-bold text-xs tracking-widest uppercase">
                    {game.category || 'Interactive Experience'}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                  {game.name}
                </h1>
                
                {game.username && (
                  <div className="inline-flex items-center bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-lg p-1 pr-4">
                    <span className="bg-gray-800 text-gray-400 text-xs uppercase font-bold px-3 py-2 rounded-md mr-3">My ID</span>
                    <span className="font-mono text-cyan-300 font-bold">{game.username}</span>
                  </div>
                )}
              </div>

              {game.joinLink && (
                <a 
                  href={game.joinLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-500 border border-purple-400/50 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Play / Connect
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="relative p-8 rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-white/5 shadow-2xl mb-16 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500"></div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            About The Game
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap max-w-4xl">
            {game.description || "No description provided for this game yet."}
          </p>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-800 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Stream Archives</span>
            </h2>
            <p className="text-gray-500 mt-1">Watch past gameplay, highlights, and streams.</p>
          </div>
          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-gray-800 border border-gray-700 text-sm font-bold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
            {archives.length} Videos Available
          </span>
        </div>

        {archives.length === 0 ? (
          <div className="text-center py-24 bg-gray-800/20 rounded-3xl border border-gray-800/50 border-dashed relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <span className="text-5xl mb-4 block filter grayscale opacity-50">📼</span>
              <h3 className="text-2xl font-bold text-gray-400">No Archives Yet</h3>
              <p className="text-gray-600 mt-2">Check back later for recorded streams of {game.name}.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {archives.map(video => (
              <div 
                key={video._id} 
                className="group flex flex-col bg-[#162032] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:-translate-y-1"
              >
                <div className="w-full relative z-10 bg-black">
                  <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                </div>
                
                <div className="p-6 flex-grow flex flex-col relative z-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      video.platform?.toLowerCase() === 'twitch' 
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' 
                        : 'bg-red-900/40 text-red-300 border border-red-700/50'
                    }`}>
                      {video.platform || 'Video'}
                    </span>
                    <span className="text-xs font-mono text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
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