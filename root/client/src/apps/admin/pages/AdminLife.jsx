import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaImage, FaVideo, FaMusic, FaHeart, FaComment } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import './admin.css';

const AdminLife = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    category: 'Life updates',
    mediaType: 'none', 
    mediaUrl: ''
  });
  
  const [mediaFile, setMediaFile] = useState(null); 

  useEffect(() => { 
    fetchPosts(); 
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/more/life');
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load updates.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (post = null) => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category || 'Life updates',
        mediaType: post.mediaType || 'none',
        mediaUrl: post.mediaUrl || ''
      });
      setCurrentId(post._id);
    } else {
      setFormData({ title: '', content: '', category: 'Life updates', mediaType: 'none', mediaUrl: '' });
      setCurrentId(null);
    }
    setMediaFile(null);
    setView("form");
  };

  const handleUrlPaste = (e) => {
    const url = e.target.value;
    let type = formData.mediaType;

    // Auto-detect media type from URL
    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) type = 'image';
    else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || url.includes('youtube.com') || url.includes('youtu.be')) type = 'video';
    else if (url.match(/\.(mp3|wav|m4a)(\?.*)?$/i)) type = 'audio';
    else if (url.length > 0 && type === 'none') type = 'image'; // Fallback

    setFormData({ ...formData, mediaUrl: url, mediaType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required.");

    setSaving(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('category', formData.category);
    submitData.append('mediaType', formData.mediaType);
    
    if (formData.mediaUrl) submitData.append('mediaUrl', formData.mediaUrl);
    if (mediaFile) submitData.append('image', mediaFile); 

    const requestPromise = currentId 
      ? axios.put(`/more/life/${currentId}`, submitData)
      : axios.post('/more/life', submitData);

    toast.promise(requestPromise, {
      loading: currentId ? 'Updating...' : 'Posting update...',
      success: () => {
        fetchPosts();
        setView("list");
        return currentId ? "Update saved successfully!" : "Update posted successfully!";
      },
      error: "Failed to save update."
    }).finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Delete this update?</span>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const deletePromise = axios.delete(`/more/life/${id}`);
              
              toast.promise(deletePromise, {
                loading: 'Deleting...',
                success: () => {
                  setPosts(posts.filter(p => p._id !== id));
                  return "Update deleted.";
                },
                error: "Failed to delete update."
              });
            }} 
            style={{ flex: 1, padding: '6px 12px', background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            style={{ flex: 1, padding: '6px 12px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
          >
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
            <button className="btn primary" onClick={() => handleOpenForm()}>
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
                  <th>Stats</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No updates found. Post your first one!</td></tr>
                ) : (
                  posts.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{p.title}</td>
                      <td>
                        <span style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {p.category || 'Update'}
                        </span>
                      </td>
                      <td>
                        {p.mediaType === 'image' && <FaImage title="Image Attached" color="var(--text-secondary)" />}
                        {p.mediaType === 'video' && <FaVideo title="Video Attached" color="var(--text-secondary)" />}
                        {p.mediaType === 'audio' && <FaMusic title="Audio Attached" color="var(--text-secondary)" />}
                        {(!p.mediaType || p.mediaType === 'none') && <span style={{color: 'var(--text-muted)', fontSize: '12px'}}>None</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <span title="Reactions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaHeart color="var(--danger-color)" /> {p.reactions?.length || 0}</span>
                          <span title="Comments" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaComment color="var(--accent-primary)" /> {p.comments?.length || 0}</span>
                        </div>
                      </td>
                      <td>{new Date(p.createdAt || p.date || Date.now()).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon edit" onClick={() => handleOpenForm(p)} title="Edit">
                            <FaEdit />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(p._id)} title="Delete">
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
            <h2>{currentId ? "Edit Social Update" : "Create Social Update"}</h2>
            <button className="btn secondary" onClick={() => setView("list")}>
              <FaTimes style={{ marginRight: '8px' }}/> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h3>Content</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Title or Hook</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="E.g., Just hit a new PR!"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none' }}
                  >
                    <option value="Life updates">Life updates</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Dev Log">Dev Log</option>
                    <option value="Tips">Tips</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Text Content</label>
                <textarea 
                  placeholder="What's on your mind? (Paste a YouTube link here and it will auto-embed!)" 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  required 
                  rows="4"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="form-section mt-4">
              <h3>Attach Media (Optional)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Media Type</label>
                  <select 
                    value={formData.mediaType} 
                    onChange={e => setFormData({...formData, mediaType: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none' }}
                  >
                    <option value="none">None</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Upload File OR Paste URL</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="file" 
                      onChange={e => setMediaFile(e.target.files[0])}
                      style={{ flex: 1, padding: '10px', background: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }}
                    />
                    <input 
                      type="url" 
                      placeholder="Paste URL (Auto-detects type)..."
                      value={formData.mediaUrl} 
                      onChange={handleUrlPaste} 
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', color: 'var(--text-primary)' }}
                      disabled={!!mediaFile} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn primary mt-4" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', justifyContent: 'center' }} disabled={saving}>
              {saving ? "Saving..." : (currentId ? "Update Post" : "Post to Feed")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminLife;