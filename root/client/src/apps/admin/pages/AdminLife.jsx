import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaImage, FaVideo, FaMusic, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import './admin.css';

const AdminLife = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    category: 'Life updates',
    mediaType: 'none', 
    mediaUrl: ''
  });

  useEffect(() => { 
    fetchPosts(); 
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/more/life');
      setPosts(data || []);
    } catch {
      toast.error("Failed to load updates.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', category: 'Life updates', mediaType: 'none', mediaUrl: '' });
    setView("form");
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setFormData(post);
    setView("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      return toast.error("Title and Content are required.");
    }

    try {
      setSaving(true);

      if (editingId) {
        const { data } = await axios.put(`/more/life/${editingId}`, formData);

        setPosts(prev =>
          prev.map(p => (p._id === editingId ? data : p))
        );

        toast.success("Updated successfully!");
      } else {
        const { data } = await axios.post('/more/life', formData);

        setPosts(prev => [data, ...prev]);
        toast.success("Posted successfully!");
      }

      setView("list");
      setEditingId(null);
    } catch {
      toast.error("Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>Delete this update?</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/more/life/${id}`);
                setPosts(prev => prev.filter(p => p._id !== id));
                toast.success("Deleted successfully");
              } catch {
                toast.error("Delete failed");
              }
            }}
          >
            Delete
          </button>

          <button onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading && view === "list") return <div className="admin-container"><Loader /></div>;

  return (
    <div className="admin-container">
      {view === "list" ? (
        <>
          <div className="admin-header">
            <h2>Manage Social Feed</h2>
            <button className="btn primary" onClick={handleOpenForm}>
              <FaPlus style={{ marginRight: '8px' }}/> Post Update
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Media</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center" }}>No updates found.</td></tr>
                ) : (
                  posts.map(p => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.category}</td>
                      <td>
                        {p.mediaType === 'image' && <FaImage />}
                        {p.mediaType === 'video' && <FaVideo />}
                        {p.mediaType === 'audio' && <FaMusic />}
                        {p.mediaType === 'none' && 'None'}
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEdit(p)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(p._id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="admin-header">
            <h2>{editingId ? "Edit Update" : "Create Update"}</h2>
            <button className="btn secondary" onClick={() => setView("list")}>
              <FaTimes /> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />

            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Post"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminLife;