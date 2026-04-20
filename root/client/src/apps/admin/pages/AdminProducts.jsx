import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Assuming react-hot-toast is installed as used in Store.jsx

import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "notes",
    image: "",
    fileUrl: "",
    notionPageId: ""  
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/products");
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.image || !form.category) {
      return toast.error("Please fill in all required fields.");
    }

    if (form.category === "notes" && !form.notionPageId) {
      return toast.error("Please add a Notion Page ID for notes.");
    }

    setLoading(true);
    const toastId = toast.loading("Adding product...");

    try {
      const res = await axios.post("/products", {
        ...form,
        price: Number(form.price)
      });

      if (res.data) {
        toast.success("Product added successfully! ✅", { id: toastId });

        setForm({
          title: "",
          description: "",
          price: "",
          category: "notes",
          image: "",
          fileUrl: "",
          notionPageId: ""
        });

        fetchProducts();
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add product ❌", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const toastId = toast.loading("Deleting product...");
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Product deleted successfully", { id: toastId });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed", { id: toastId });
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-200 bg-slate-900 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Manage Products</h2>
        <p className="text-slate-400 mt-1">Add, review, and remove products from your store.</p>
      </div>

      {/* Add Product Form */}
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 mb-10">
        <h3 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-3">Add New Product</h3>
        
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
              <input 
                name="title" 
                placeholder="e.g., Complete React Course" 
                value={form.title} 
                onChange={handleChange} 
                required 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="notes">Notes</option>
                <option value="roadmap">Roadmap</option>
                <option value="project">Project</option>
                <option value="code">Code</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹) *</label>
              <input 
                name="price" 
                type="number" 
                placeholder="e.g., 499 (Use 0 for Free)" 
                value={form.price} 
                onChange={handleChange} 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail Image URL *</label>
              <input 
                name="image" 
                placeholder="https://..." 
                value={form.image} 
                onChange={handleChange} 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Dynamic Field: File URL or Notion Page ID */}
            {form.category !== "notes" ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">File URL (Download Link)</label>
                <input 
                  name="fileUrl" 
                  placeholder="Link to GitHub / Drive / Zip" 
                  value={form.fileUrl} 
                  onChange={handleChange} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Notion Page ID *</label>
                <input 
                  name="notionPageId" 
                  placeholder="e.g., 1234567890abcdef1234567890abcdef" 
                  value={form.notionPageId} 
                  onChange={handleChange} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea 
                name="description" 
                placeholder="Briefly describe the product..." 
                value={form.description} 
                onChange={handleChange} 
                rows="3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                loading 
                ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
              }`}
            >
              {loading ? "Saving Product..." : "+ Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <h3 className="text-xl font-semibold text-white mb-6 border-b border-slate-800 pb-3">Existing Products</h3>
      
      {products.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No products found. Create your first product above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col hover:border-slate-600 transition-colors shadow-sm">
              {/* Card Image */}
              <div className="h-44 w-full bg-slate-900 relative">
                <img 
                  src={p.image || "/default-product.png"} 
                  alt={p.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-md text-sky-400 uppercase tracking-wider border border-slate-700/50">
                    {p.category}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1" title={p.title}>
                  {p.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                  {p.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-emerald-400">
                    {p.price === 0 ? "Free" : `₹${p.price}`}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="bg-slate-900/50 border-t border-slate-700 p-3 flex justify-end">
                <button 
                  onClick={() => handleDelete(p._id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;