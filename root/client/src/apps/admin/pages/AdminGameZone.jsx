import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../../../core/utils/axios';
import Loader from '../../../core/components/Loader';
import { FaGamepad, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './AdminGameZone.css';

const AdminGameZone = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    joinLink: '',
    username: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/more/games');
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEdit = (game) => {
    setEditingId(game._id);
    setFormData({
      name: game.name || '',
      category: game.category || '',
      description: game.description || '',
      joinLink: game.joinLink || '',
      username: game.username || ''
    });
    setImageFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', description: '', joinLink: '', username: '' });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    
    const toastId = toast.loading("Deleting game...");
    try {
      await axios.delete(`/more/games/${id}`);
      toast.success("Game deleted successfully!", { id: toastId });
      fetchGames(); 
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game.", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('joinLink', formData.joinLink);
    submitData.append('username', formData.username);
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    const toastId = toast.loading(editingId ? "Updating game..." : "Adding game...");

    try {
      if (editingId) {
        await axios.put(`/more/games/${editingId}`, submitData);
        toast.success('Game updated successfully!', { id: toastId });
      } else {
        await axios.post('/more/games', submitData);
        toast.success('Game added successfully!', { id: toastId });
      }
      
      cancelEdit();
      fetchGames();
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error(error.response?.data?.message || "Failed to save game.", { id: toastId });
    }
  };

  return (
    <div className="agz-container animated-fade-in">
      <div className="agz-header">
        <h1>Manage GameZone</h1>
        <p>Add games you play, share your usernames, and link to external lobbies.</p>
      </div>

      <div className="agz-form-card">
        <h2 className="agz-form-title">
          {editingId ? <><FaEdit /> Edit Game</> : <><FaPlus /> Add New Game</>}
        </h2>
        
        <form onSubmit={handleSubmit} className="agz-form">
          <div className="agz-form-grid">
            <div className="agz-input-group">
              <label>Game Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Valorant" />
            </div>
            <div className="agz-input-group">
              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., FPS, Strategy" />
            </div>
            <div className="agz-input-group">
              <label>Join Link / Play URL</label>
              <input type="url" name="joinLink" value={formData.joinLink} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div className="agz-input-group">
              <label>Your Username / ID</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="e.g., Ninja#1234" />
            </div>
            <div className="agz-input-group agz-full-width">
              <label>Cover Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
              {editingId && !imageFile && <p className="agz-help-text">Leave empty to keep existing image.</p>}
            </div>
            <div className="agz-input-group agz-full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Briefly describe the game or your rank..."></textarea>
            </div>
          </div>
          
          <div className="agz-form-actions">
            <button type="submit" className="agz-btn-submit">
              {editingId ? 'Update Game' : 'Add Game'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="agz-btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="agz-inventory-section">
        <h2><FaGamepad /> Existing Games</h2>
        {loading ? (
          <div className="agz-loader-wrapper"><Loader /></div>
        ) : games.length === 0 ? (
          <div className="agz-empty-state">No games added yet. Start building your GameZone!</div>
        ) : (
          <div className="agz-game-grid">
            {games.map(game => (
              <div key={game._id} className="agz-game-card">
                <div className="agz-card-image">
                  <img src={game.coverImage || "/default-product.png"} alt={game.name} />
                  <span className="agz-badge-category">{game.category || 'Game'}</span>
                </div>
                <div className="agz-card-content">
                  <h3>{game.name}</h3>
                  <p className="agz-card-desc">{game.description}</p>
                </div>
                <div className="agz-card-actions">
                  <button onClick={() => handleEdit(game)} className="agz-btn-edit">Edit</button>
                  <button onClick={() => handleDelete(game._id)} className="agz-btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGameZone;