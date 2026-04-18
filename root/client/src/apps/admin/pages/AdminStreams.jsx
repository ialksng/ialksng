import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import './admin.css';

const AdminStreams = () => {
  const [streams, setStreams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'YouTube',
    videoUrl: '',
    embedUrl: '',
    category: 'gaming',
    status: 'archived'
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const { data } = await axios.get('/api/more/streams/all'); 
      setStreams(data);
    } catch (err) {
      console.error("Failed to fetch streams", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/more/streams', formData);
      setFormData({ title: '', platform: 'YouTube', videoUrl: '', embedUrl: '', category: 'gaming', status: 'archived' });
      fetchStreams(); 
      alert("Stream added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add stream.");
    }
  };

  const toggleLiveStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'live' ? 'archived' : 'live';
      await axios.put(`/api/more/streams/${id}/status`, { status: newStatus });
      fetchStreams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage Streams & Live Status</h2>

      <div className="admin-card panel-dark">
        <h3>Add New Stream / Video</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleInputChange}>
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="gaming">Gaming</option>
                <option value="general">Just Chatting / General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Embed URL (for the iframe)</label>
            <input type="text" name="embedUrl" placeholder="https://www.youtube.com/embed/..." value={formData.embedUrl} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="admin-btn primary">Add to Database</button>
        </form>
      </div>

      <div className="admin-card panel-dark" style={{ marginTop: '2rem' }}>
        <h3>Stream Database</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Platform</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream._id} className={stream.status === 'live' ? 'row-highlight' : ''}>
                <td>
                  <span className={`admin-badge ${stream.status === 'live' ? 'badge-live' : 'badge-offline'}`}>
                    {stream.status.toUpperCase()}
                  </span>
                </td>
                <td>{stream.title}</td>
                <td>{stream.platform}</td>
                <td>{new Date(stream.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => toggleLiveStatus(stream._id, stream.status)}
                    className={`admin-btn ${stream.status === 'live' ? 'btn-danger' : 'btn-success'}`}
                  >
                    {stream.status === 'live' ? 'End Stream (Archive)' : 'Go Live'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStreams;