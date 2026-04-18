import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import './admin.css';

const AdminLife = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Life updates' });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await axios.get('/more/life');
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/more/life', formData);
    setFormData({ title: '', content: '', category: 'Life updates' });
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this post?")) {
      await axios.delete(`/more/life/${id}`);
      fetchPosts();
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage Life Updates</h2>
      <div className="admin-card panel-dark">
        <form onSubmit={handleSubmit} className="admin-form">
          <input type="text" placeholder="Update Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="form-control" />
          <textarea placeholder="Update Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required className="form-control" rows="4"></textarea>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="form-control">
            <option value="Life updates">Life updates</option><option value="Fitness">Fitness</option><option value="Tips">Tips</option>
          </select>
          <button type="submit" className="admin-btn primary" style={{marginTop: '1rem'}}>Post Update</button>
        </form>
      </div>

      <div className="admin-card panel-dark" style={{ marginTop: '2rem' }}>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td><td>{p.category}</td>
                <td><button onClick={() => handleDelete(p._id)} className="admin-btn btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminLife;