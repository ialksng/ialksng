import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../../../core/utils/axios';
import './AdminStreams.css';

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
      toast.error("Failed to load streams data.");
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
      gameId: stream.gameId?._id || stream.gameId || '', 
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
    
    const toastId = toast.loading("Deleting stream...");
    try {
      await axios.delete(`/more/streams/${id}`);
      toast.success("Stream deleted successfully!", { id: toastId });
      fetchData(); 
    } catch (error) {
      console.error("Error deleting stream:", error);
      toast.error("Failed to delete stream.", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitData = { ...formData };

    // BUG FIX: Prevent Mongoose CastError by removing empty gameId
    if (!submitData.gameId) {
      delete submitData.gameId;
    }

    // Auto-generate Embed URLs
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

    const toastId = toast.loading(editingId ? "Updating stream..." : "Adding stream...");

    try {
      if (editingId) {
        await axios.put(`/more/streams/${editingId}`, submitData);
        toast.success('Stream updated successfully!', { id: toastId });
      } else {
        await axios.post('/more/streams', submitData);
        toast.success('Stream added successfully!', { id: toastId });
      }
      
      cancelEdit();
      fetchData();
    } catch (error) {
      console.error("Error saving stream:", error);
      toast.error(error.response?.data?.message || "Failed to save stream.", { id: toastId });
    }
  };

  return (
    <div className="admin-streams-container">
      <div className="admin-header">
        <h1>Manage Live Streams & Archives</h1>
        <p>Add new broadcasts, update statuses, or attach streams to games.</p>
      </div>

      <div className="admin-form-card">
        <h2 className="form-title">
          {editingId ? 'Edit Stream' : 'Add New Stream'}
        </h2>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Stream Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g., Grinding Ranked Valorant" 
              />
            </div>
            
            <div className="form-group">
              <label>Platform *</label>
              <select name="platform" value={formData.platform} onChange={handleInputChange}>
                <option value="youtube">YouTube</option>
                <option value="twitch">Twitch</option>
                <option value="facebook">Facebook Gaming</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Game (Optional)</label>
              <select name="gameId" value={formData.gameId} onChange={handleInputChange}>
                <option value="">-- No specific game --</option>
                {games.map(game => (
                  <option key={game._id} value={game._id}>{game.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Source URL (Direct link) *</label>
              <input 
                type="url" 
                name="url" 
                value={formData.url} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g. https://twitch.tv/ninja" 
              />
            </div>

            <div className="form-group">
              <label>Embed URL (For display)</label>
              <input 
                type="url" 
                name="embedUrl" 
                value={formData.embedUrl} 
                onChange={handleInputChange} 
                placeholder="Leave blank to auto-generate" 
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="planned">Planned / Upcoming</option>
                <option value="live">Live Now</option>
                <option value="archived">Archived / VOD</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update Stream' : 'Add Stream'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="streams-list-section">
        <h2>Existing Streams</h2>
        
        {loading ? (
          <div className="admin-loading">Loading streams...</div>
        ) : streams.length === 0 ? (
          <div className="admin-empty">No streams found. Add one above.</div>
        ) : (
          <div className="stream-grid">
            {streams.map(stream => (
              <div key={stream._id} className="stream-card">
                <div className={`status-ribbon ${stream.status}`}>
                  {stream.status.toUpperCase()}
                </div>

                <div className="stream-card-content">
                  <h3 className="stream-card-title">{stream.title}</h3>
                  
                  <div className="stream-tags">
                    <span className="tag platform-tag">{stream.platform}</span>
                    {stream.gameId && (
                      <span className="tag game-tag">
                        {typeof stream.gameId === 'object' ? stream.gameId.name : 'Attached to Game'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="stream-card-actions">
                  <button onClick={() => handleEdit(stream)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(stream._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStreams;