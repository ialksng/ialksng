import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import './admin.css';

const AdminGameZone = () => {
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', username: '', joinLink: '' });

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    const { data } = await axios.get('/more/games');
    setGames(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/more/games', formData);
    setFormData({ name: '', description: '', username: '', joinLink: '' });
    fetchGames();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this game?")) {
      await axios.delete(`/more/games/${id}`);
      fetchGames();
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage GameZone</h2>
      <div className="admin-card panel-dark">
        <form onSubmit={handleSubmit} className="admin-form">
          <input type="text" placeholder="Game Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="form-control" />
          <input type="text" placeholder="Username / ID" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="form-control" />
          <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-control" />
          <input type="text" placeholder="Join/Friend Link" value={formData.joinLink} onChange={e => setFormData({...formData, joinLink: e.target.value})} className="form-control" />
          <button type="submit" className="btn-premium" style={{marginTop: '1rem'}}>Add Game</button>
        </form>
      </div>

      <div className="admin-card panel-dark" style={{ marginTop: '2rem' }}>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Username</th><th>Actions</th></tr></thead>
          <tbody>
            {games.map(g => (
              <tr key={g._id}>
                <td>{g.name}</td><td>{g.username}</td>
                <td><button onClick={() => handleDelete(g._id)} className="admin-btn btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminGameZone;