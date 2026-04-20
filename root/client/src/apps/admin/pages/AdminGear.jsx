import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaRocket, FaLaptopCode, FaExternalLinkAlt } from 'react-icons/fa';
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import './AdminGear.css';

const AdminGear = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    externalLink: '',
    category: 'Software'
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get('/more/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load ecosystem products.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      externalLink: product.externalLink || '',
      category: product.category || 'Software'
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', externalLink: '', category: 'Software' });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.externalLink) {
      return toast.error("Name and Launch URL are required.");
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('externalLink', formData.externalLink);
    submitData.append('category', formData.category);
    
    // Crucial: 'image' matches upload.single('image') in backend routes
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    const toastId = toast.loading(editingId ? "Updating platform..." : "Launching new app...");

    try {
      if (editingId) {
        // Your backend more.routes.js currently doesn't show a PUT for products, 
        // if it fails, check if you need to add router.put('/products/:id', ...)
        await axios.put(`/more/products/${editingId}`, submitData);
        toast.success('Platform updated successfully!', { id: toastId });
      } else {
        await axios.post('/more/products', submitData);
        toast.success('Platform launched to ecosystem! 🚀', { id: toastId });
      }
      
      cancelEdit();
      fetchProducts();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Failed to save product.", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this platform from your ecosystem?")) return;
    
    const toastId = toast.loading("Removing platform...");
    try {
      await axios.delete(`/more/products/${id}`);
      toast.success("Platform removed.", { id: toastId });
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed.", { id: toastId });
    }
  };

  if (fetching) {
    return (
      <div className="agear-loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="agear-container animated-fade-in">
      <div className="agear-header">
        <h1>Manage Ecosystem</h1>
        <p>Showcase the platforms and applications you've engineered.</p>
      </div>

      <div className="agear-form-card">
        <h2 className="agear-form-title">
          {editingId ? <><FaEdit /> Edit Application</> : <><FaPlus /> Launch New App</>}
        </h2>
        
        <form onSubmit={handleSubmit} className="agear-form">
          <div className="agear-form-grid">
            <div className="agear-input-group">
              <label>App Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g., Gurukul" 
              />
            </div>
            
            <div className="agear-input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Software">Software</option>
                <option value="SaaS">SaaS</option>
                <option value="Web App">Web App</option>
                <option value="Tool">Tool</option>
              </select>
            </div>

            <div className="agear-input-group agear-full-width">
              <label>External Link (Launch URL) *</label>
              <input 
                type="url" 
                name="externalLink" 
                value={formData.externalLink} 
                onChange={handleInputChange} 
                required 
                placeholder="https://gurukul.ialksng.me" 
              />
            </div>

            <div className="agear-input-group agear-full-width">
              <label>App Icon / Cover Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
                className="file-input" 
              />
              {editingId && !imageFile && <p className="help-text">Leave empty to keep current icon.</p>}
            </div>

            <div className="agear-input-group agear-full-width">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="3" 
                placeholder="Explain the platform's core purpose..."
              ></textarea>
            </div>
          </div>
          
          <div className="agear-form-actions">
            <button type="submit" className="agear-btn-submit" disabled={loading}>
              {editingId ? 'Save Changes' : 'Deploy App'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="agear-btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="agear-list-section">
        <h2><FaLaptopCode /> Current Ecosystem</h2>
        
        {products.length === 0 ? (
          <div className="agear-empty-state">No applications found in your ecosystem.</div>
        ) : (
          <div className="agear-grid">
            {products.map(p => (
              <div key={p._id} className="agear-card">
                <div className="agear-card-content">
                  <div className="agear-icon-box">
                    {p.name ? p.name.charAt(0).toUpperCase() : <FaRocket />}
                  </div>
                  <h3>{p.name}</h3>
                  <span className="agear-badge">{p.category}</span>
                  <p className="agear-card-desc">{p.description}</p>
                </div>
                
                <div className="agear-card-actions">
                  <button onClick={() => handleEdit(p)} className="agear-btn-edit">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="agear-btn-delete">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGear;