import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaImage, FaVideo, FaMusic, FaLink, FaLeaf } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import './AdminLife.css';

const AdminLife = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      category: post.category || 'Life updates',
      mediaType: post.mediaType || 'none',
      mediaUrl: post.mediaUrl || ''
    });
    setMediaFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', category: 'Life updates', mediaType: 'none', mediaUrl: '' });
    setMediaFile(null);
  };

  const handleUrlPaste = (e) => {
    const url = e.target.value.trim();
    let type = formData.mediaType;

    if (formData.mediaType === "none") {
      if (/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url)) type = 'image';
      else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || /(youtube\.com|youtu\.be)/i.test(url)) type = 'video';
      else if (/\.(mp3|wav|m4a)(\?.*)?$/i.test(url)) type = 'audio';
      else if (url) type = 'link';
    }

    setFormData({ ...formData, mediaUrl: url, mediaType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required.");
    if (formData.mediaType === "link" && !formData.mediaUrl) return toast.error("Please provide a valid link.");
    if (mediaFile && formData.mediaType === "link") return toast.error("Link posts cannot include uploaded files.");

    const toastId = toast.loading(editingId ? "Updating post..." : "Publishing post...");

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('category', formData.category);
    submitData.append('mediaType', formData.mediaType);
    
    if (formData.mediaUrl) submitData.append('mediaUrl', formData.mediaUrl);
    if (mediaFile) submitData.append('image', mediaFile); 

    try {
      if (editingId) {
        await axios.put(`/more/life/${editingId}`, submitData);
        toast.success("Update saved successfully!", { id: toastId });
      } else {
        await axios.post('/more/life', submitData);
        toast.success("Update posted successfully!", { id: toastId });
      }
      cancelEdit();
      fetchPosts();
    } catch (err) {
      toast.error("Failed to save update.", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    
    const toastId = toast.loading("Deleting update...");
    try {
      await axios.delete(`/more/life/${id}`);
      toast.success("Update deleted.", { id: toastId });
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete update.", { id: toastId });
    }
  };

  const getMediaIcon = (type) => {
    switch(type) {
      case 'image': return <FaImage title="Image" />;
      case 'video': return <FaVideo title="Video" />;
      case 'audio': return <FaMusic title="Audio" />;
      case 'link': return <FaLink title="Link" />;
      default: return null;
    }
  };

  return (
    <div className="al-container animated-fade-in">
      <div className="al-header">
        <h1>Manage Dev Log & Life</h1>
        <p>Post updates, share your fitness journey, or log your daily development thoughts.</p>
      </div>

      <div className="al-form-card">
        <h2 className="al-form-title">
          {editingId ? <><FaEdit /> Edit Update</> : <><FaPlus /> Create New Update</>}
        </h2>

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-form-grid">
            <div className="al-input-group">
              <label>Title or Hook *</label>
              <input 
                type="text" name="title" required placeholder="E.g., Just hit a new PR!"
                value={formData.title} onChange={handleInputChange} 
              />
            </div>
            
            <div className="al-input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Life updates">Life updates</option>
                <option value="Fitness">Fitness</option>
                <option value="Dev Log">Dev Log</option>
                <option value="Tips">Tips</option>
              </select>
            </div>

            <div className="al-input-group al-full-width">
              <label>Text Content *</label>
              <textarea 
                name="content" required rows="4"
                placeholder="What's on your mind? (Paste a YouTube link here and it will auto-embed!)" 
                value={formData.content} onChange={handleInputChange} 
              />
            </div>

            <div className="al-input-group">
              <label>Media Type (Optional)</label>
              <select name="mediaType" value={formData.mediaType} onChange={handleInputChange}>
                <option value="none">None</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="link">Link</option>
              </select>
            </div>

            <div className="al-input-group">
              <label>{formData.mediaType === "link" ? "Paste Link URL" : "Upload File OR Paste URL"}</label>
              <div className="al-media-inputs">
                <input 
                  type="file" 
                  onChange={e => setMediaFile(e.target.files[0])}
                  disabled={formData.mediaType === "link"}
                  className="file-input"
                />
                <input 
                  type="url" 
                  placeholder="Paste URL..."
                  value={formData.mediaUrl} 
                  onChange={handleUrlPaste} 
                  disabled={!!mediaFile} 
                />
              </div>
            </div>
          </div>

          <div className="al-form-actions">
            <button type="submit" className="al-btn-submit">
              {editingId ? 'Save Changes' : 'Post to Feed'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="al-btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="al-inventory-section">
        <h2><FaLeaf /> Social Feed History</h2>
        
        {loading ? (
          <div className="al-loader-wrapper"><Loader /></div>
        ) : posts.length === 0 ? (
          <div className="al-empty-state">No updates found. Post your first one above!</div>
        ) : (
          <div className="al-post-grid">
            {posts.map(post => (
              <div key={post._id} className="al-post-card">
                <div className="al-card-header">
                  <span className="al-badge-category">{post.category}</span>
                  <span className="al-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="al-card-content">
                  <h3 className="al-post-title">{post.title}</h3>
                  <p className="al-post-desc">{post.content}</p>
                </div>
                
                <div className="al-card-meta">
                  <div className="al-media-indicator">
                    {getMediaIcon(post.mediaType) || <span className="no-media">No Media</span>}
                  </div>
                  <div className="al-stats">
                    <span>❤️ {post.reactions?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>

                <div className="al-card-actions">
                  <button onClick={() => handleEdit(post)} className="al-btn-edit">Edit</button>
                  <button onClick={() => handleDelete(post._id)} className="al-btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLife;