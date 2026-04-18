import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import './admin.css';

const AdminGear = () => {
  const [gear, setGear] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Tech', externalLink: '' });

  useEffect(() => { fetchGear(); }, []);

  const fetchGear = async () => {
    const { data } = await axios.get('/api/more/products');
    setGear(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/more/products', formData);
    setFormData({ name: '', description: '', category: 'Tech', externalLink: '' });
    fetchGear();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`/api/more/products/${id}`);
      fetchGear();
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage Products & Gear</h2>
      <div className="admin-card panel-dark">
        <form onSubmit={handleSubmit} className="admin-form">
          <input type="text" placeholder="Item Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="form-control" />
          <input type="text" placeholder="Why I use it (Short Desc)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="form-control" />
          <input type="text" placeholder="External Link" value={formData.externalLink} onChange={e => setFormData({...formData, externalLink: e.target.value})} required className="form-control" />
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="form-control">
            <option value="Tech">Tech</option><option value="Software">Software</option><option value="Desk Setup">Desk Setup</option>
          </select>
          <button type="submit" className="admin-btn primary" style={{marginTop: '1rem'}}>Add Gear</button>
        </form>
      </div>

      <div className="admin-card panel-dark" style={{ marginTop: '2rem' }}>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {gear.map(g => (
              <tr key={g._id}>
                <td>{g.name}</td><td>{g.category}</td>
                <td><button onClick={() => handleDelete(g._id)} className="admin-btn btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminGear;