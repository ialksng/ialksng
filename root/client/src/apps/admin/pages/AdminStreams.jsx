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
      const { data } = await axios.get('/more/streams/all');
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
      await axios.post('/more/streams', formData);

      setFormData({
        title: '',
        platform: 'YouTube',
        videoUrl: '',
        embedUrl: '',
        category: 'gaming',
        status: 'archived'
      });

      fetchStreams();
      alert("Stream added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add stream. Check console.");
    }
  };

  const toggleLiveStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'live' ? 'archived' : 'live';
      await axios.put(`/more/streams/${id}/status`, { status: newStatus });
      fetchStreams();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to toggle status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stream?")) {
      try {
        await axios.delete(`/more/streams/${id}`);
        fetchStreams();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to delete.");
      }
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
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="form-control" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleInputChange} className="form-control">
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="form-control">
                <option value="gaming">Gaming</option>
                <option value="general">Just Chatting / General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Standard Video/Stream URL</label>
            <input type="text" name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." value={formData.videoUrl} onChange={handleInputChange} required className="form-control" />
          </div>

          <div className="form-group">
            <label>Embed URL</label>
            <input type="text" name="embedUrl" placeholder="https://www.youtube.com/embed/..." value={formData.embedUrl} onChange={handleInputChange} required className="form-control" />
          </div>

          <button type="submit" className="btn-premium" style={{ marginTop: '1rem' }}>
            Add to Database
          </button>
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
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => toggleLiveStatus(stream._id, stream.status)}
                    className={`admin-btn ${stream.status === 'live' ? 'btn-danger' : 'btn-success'}`}
                  >
                    {stream.status === 'live' ? 'End Stream' : 'Go Live'}
                  </button>
                  <button onClick={() => handleDelete(stream._id)} className="admin-btn btn-danger">
                    Delete
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