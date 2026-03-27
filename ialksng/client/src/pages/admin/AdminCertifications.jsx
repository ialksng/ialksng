import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [formData, setFormData] = useState({ title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '' });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      // Removed /api/ since axios.js already has it in the baseURL
      const { data } = await axios.get('/certifications'); 
      setCertifications(data);
    } catch (error) {
      console.error('Error fetching certifications', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Removed /api/ here too
      await axios.post('/certifications', formData); 
      setFormData({ title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '' });
      fetchCertifications();
      alert("✅ Certification added successfully!"); // Added success message
    } catch (error) {
      console.error('Error adding certification', error);
      alert("❌ Failed to add certification. Check console for details."); // Added error message
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        // Removed /api/ here too
        await axios.delete(`/certifications/${id}`); 
        fetchCertifications();
        alert("🗑️ Certification deleted!");
      } catch (error) {
        console.error('Error deleting certification', error);
        alert("❌ Failed to delete certification.");
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Certifications</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', maxWidth: '400px' }}>
        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <input type="text" placeholder="Issuer (e.g., Google, Coursera)" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required />
        <input type="text" placeholder="Date (e.g., Aug 2023)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        <input 
            type="text" 
            placeholder="Credential URL (Google Drive Link, etc.)" 
            value={formData.credentialUrl} 
            onChange={e => setFormData({...formData, credentialUrl: e.target.value})} 
        />
        <input type="text" placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        <button type="submit">Add Certification</button>
      </form>

      <div className="cert-list">
        {certifications.length === 0 && <p>No certifications added yet.</p>}
        {certifications.map(cert => (
          <div key={cert._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{cert.title}</h3>
            <p>{cert.issuer} - {cert.date}</p>
            <button onClick={() => handleDelete(cert._id)} style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertifications;