import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';

const AdminStreams = () => {
  const [streams, setStreams] = useState([]);
  const [games, setGames] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    platform: 'youtube', 
    url: '',
    embedUrl: '',
    gameId: '', 
    status: 'planned'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [streamsRes, gamesRes] = await Promise.all([
        axios.get('/more/streams'),
        axios.get('/more/games')
      ]);
      
      setStreams(streamsRes.data);
      setGames(gamesRes.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (stream) => {
    setEditingId(stream._id);
    setFormData({
      title: stream.title || '',
      platform: stream.platform || 'youtube',
      url: stream.url || '',
      embedUrl: stream.embedUrl || '',
      gameId: stream.gameId?._id || stream.gameId || '', // Handle populated vs unpopulated gameId
      status: stream.status || 'planned'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', platform: 'youtube', url: '', embedUrl: '', gameId: '', status: 'planned' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stream?")) return;
    try {
      await axios.delete(`/more/streams/${id}`);
      fetchData(); 
    } catch (error) {
      console.error("Error deleting stream:", error);
      alert("Failed to delete stream.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitData = { ...formData };
    if (!submitData.embedUrl && submitData.url) {
      if (submitData.platform === 'youtube' && submitData.url.includes('v=')) {
        const videoId = submitData.url.split('v=')[1].substring(0, 11);
        submitData.embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (submitData.platform === 'twitch') {
         const channelMatch = submitData.url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
         if(channelMatch) {
             submitData.embedUrl = `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}`;
         }
      }
    }

    try {
      if (editingId) {
        await axios.put(`/more/streams/${editingId}`, submitData);
        alert('Stream updated successfully!');
      } else {
        await axios.post('/more/streams', submitData);
        alert('Stream added successfully!');
      }
      
      cancelEdit();
      fetchData();
    } catch (error) {
      console.error("Error saving stream:", error);
      alert("Failed to save stream.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Manage Live Streams & Archives</h1>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10">
        <h2 className="text-xl font-bold mb-4 text-purple-400">
          {editingId ? 'Edit Stream' : 'Add New Stream'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Stream Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Platform</label>
              <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none">
                <option value="youtube">YouTube</option>
                <option value="twitch">Twitch</option>
                <option value="facebook">Facebook Gaming</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Select Game (Optional)</label>
              <select name="gameId" value={formData.gameId} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none">
                <option value="">-- No specific game --</option>
                {games.map(game => (
                  <option key={game._id} value={game._id}>{game.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Source URL (Direct link)</label>
              <input type="url" name="url" value={formData.url} onChange={handleInputChange} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" placeholder="e.g. https://youtube.com/watch?v=..." />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Embed URL (For display)</label>
              <input type="url" name="embedUrl" value={formData.embedUrl} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" placeholder="Auto-generated if left blank (for YT)" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none">
                <option value="planned">Planned / Upcoming</option>
                <option value="live">Live Now</option>
                <option value="archived">Archived / VOD</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              {editingId ? 'Update Stream' : 'Add Stream'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Manage Streams</h2>
      {loading ? (
        <p className="text-gray-400">Loading streams...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.map(stream => (
            <div key={stream._id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex flex-col relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${
                    stream.status === 'live' ? 'bg-red-600 text-white animate-pulse' : 
                    stream.status === 'archived' ? 'bg-gray-600 text-gray-300' : 
                    'bg-blue-600 text-white'
                }`}>
                    {stream.status.toUpperCase()}
                </div>

              <div className="flex items-start justify-between mb-2 mt-4">
                <h3 className="font-bold text-lg text-white">{stream.title}</h3>
              </div>
              
              <div className="flex gap-2 mb-3">
                 <span className="bg-gray-900 text-xs px-2 py-1 rounded-md text-purple-400 border border-gray-700 uppercase">
                    {stream.platform}
                 </span>
                 {stream.gameId && (
                     <span className="bg-cyan-900/30 text-xs px-2 py-1 rounded-md text-cyan-400 border border-cyan-800/50">
                        {typeof stream.gameId === 'object' ? stream.gameId.name : 'Has Game ID'}
                     </span>
                 )}
              </div>

              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-700">
                <button onClick={() => handleEdit(stream)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded transition-colors text-sm font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(stream._id)} className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-200 py-1.5 rounded transition-colors text-sm font-medium border border-red-800/50">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {streams.length === 0 && <p className="text-gray-500 col-span-full">No streams found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminStreams;