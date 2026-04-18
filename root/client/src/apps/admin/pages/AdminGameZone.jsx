import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';

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
    try {
      await axios.delete(`/more/games/${id}`);
      fetchGames(); 
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Failed to delete game.");
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

    try {
      if (editingId) {
        // Removed manual headers, Axios handles FormData automatically
        await axios.put(`/more/games/${editingId}`, submitData);
        alert('Game updated successfully!');
      } else {
        // Removed manual headers, Axios handles FormData automatically
        await axios.post('/more/games', submitData);
        alert('Game added successfully!');
      }
      
      cancelEdit();
      fetchGames();
    } catch (error) {
      console.error("Error saving game:", error);
      // Alerts the exact backend error if it fails again
      alert(error.response?.data?.message || "Failed to save game.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Manage Game Zone</h1>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10">
        <h2 className="text-xl font-bold mb-4 text-purple-400">
          {editingId ? 'Edit Game' : 'Add New Game'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Game Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category (e.g. Action, RPG)</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Join Link / Play URL</label>
              <input type="text" name="joinLink" value={formData.joinLink} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your ID / Username in Game</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
              {editingId && !imageFile && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image.</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"></textarea>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              {editingId ? 'Update Game' : 'Add Game'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Existing Games</h2>
      {loading ? (
        <p className="text-gray-400">Loading games...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map(game => (
            <div key={game._id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-white">{game.name}</h3>
                <span className="bg-gray-700 text-xs px-2 py-1 rounded-md text-cyan-400">{game.category}</span>
              </div>
              {game.coverImage && (
                <img src={game.coverImage} alt={game.name} className="w-full h-32 object-cover rounded-lg mb-3 opacity-80" />
              )}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{game.description}</p>
              
              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-700">
                <button onClick={() => handleEdit(game)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded transition-colors text-sm font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(game._id)} className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-200 py-1.5 rounded transition-colors text-sm font-medium border border-red-800/50">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {games.length === 0 && <p className="text-gray-500 col-span-full">No games added yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminGameZone;