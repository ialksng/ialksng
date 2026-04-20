import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaRocket, FaLaptopCode } from 'react-icons/fa';
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import './AdminGear.css';

const AdminGear = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const { data } = await axios.get('/more/products');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load ecosystem products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (imageFile) submitData.append('image', imageFile);

    const toastId = toast.loading(editingId ? "Updating platform..." : "Adding to ecosystem...");

    try {
      if (editingId) {
        await axios.put(`/more/products/${editingId}`, submitData);
        toast.success('Platform updated!', { id: toastId });
      } else {
        await axios.post('/more/products', submitData);
        toast.success('Platform launched!', { id: toastId });
      }
      setEditingId(null);
      setFormData({ name: '', description: '', externalLink: '', category: 'Software' });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      toast.error("Operation failed.", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this platform from your ecosystem?")) return;
    const toastId = toast.loading("Removing...");
    try {
      await axios.delete(`/more/products/${id}`);
      toast.success("Platform removed.", { id: toastId });
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed.", { id: toastId });
    }
  };

  return (
    <div className="agear-container animated-fade-in">
      <div className="agear-header">
        <h1>Manage Ecosystem</h1>
        <p>Showcase the platforms and applications you've engineered.</p>
      </div>

      <div className="agear-form-card">
        <h2 className="agear-form-title">
          {editingId ? <><FaEdit /> Edit App</> : <><FaPlus /> Launch New App</>}
        </h2>
        <form onSubmit={handleSubmit} className="agear-form">
          <div className="agear-form-grid">
            <div className="agear-input-group">
              <label>App Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Gurukul" />
            </div>
            <div className="agear-input-group">
              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., LMS, Portfolio" />
            </div>
            <div className="agear-input-group agear-full-width">
              <label>External Link (Launch URL) *</label>
              <input type="url" name="externalLink" value={formData.externalLink} onChange={handleInputChange} required placeholder="https://gurukul.ialksng.me" />
            </div>
            <div className="agear-input-group agear-full-width">
              <label>App Icon / Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="file-input" />
            </div>
            <div className="agear-input-group agear-full-width">
              <label>Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Explain the platform's core purpose..."></textarea>
            </div>
          </div>
          <div className="agear-form-actions">
            <button type="submit" className="agear-btn-submit">{editingId ? 'Save Changes' : 'Deploy App'}</button>
            {editingId && <button type="button" onClick={() => setEditingId(null)} className="agear-btn-cancel">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="agear-list-section">
        <h2><FaLaptopCode /> Current Ecosystem</h2>
        {loading ? <div className="agear-loader"><Loader /></div> : (
          <div className="agear-grid">
            {products.map(p => (
              <div key={p._id} className="agear-card">
                <div className="agear-card-content">
                  <div className="agear-icon-box">{p.name?.[0]}</div>
                  <h3>{p.name}</h3>
                  <span className="agear-badge">{p.category}</span>
                </div>
                <div className="agear-card-actions">
                  <button onClick={() => handleEdit(p)} className="agear-btn-edit">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="agear-btn-delete">Delete</button>
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