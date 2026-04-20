import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";
import { FaPlus, FaTrash, FaBoxOpen, FaEdit } from "react-icons/fa";
import "./AdminProducts.css";

const isValidMongoId = (id) => typeof id === "string" && id.length === 24;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "notes",
    image: "",
    fileUrl: "",
    notionUrl: ""
  });

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/products");

      // 🔥 ONLY FIX ADDED HERE
      const cleanProducts = (res.data.products || res.data || []).filter(p => {
        if (!isValidMongoId(p._id)) {
          console.warn("Removed invalid product:", p._id);
          return false;
        }
        return true;
      });

      setProducts(cleanProducts);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load existing products.");
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

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "notes",
      image: product.image || "",
      fileUrl: product.fileUrl || "",
      notionUrl: product.notionUrl || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      category: "notes",
      image: "",
      fileUrl: "",
      notionUrl: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || form.price === "" || !form.image || !form.category) {
      return toast.error("Please fill all required fields.");
    }

    if (form.category === "notes" && !form.notionUrl) {
      return toast.error("Please add a Notion URL for notes.");
    }

    setLoading(true);
    const toastId = toast.loading(editingId ? "Updating product..." : "Adding product to store...");

    try {
      const payload = {
        ...form,
        price: Number(form.price)
      };

      if (editingId) {
        await axios.put(`/products/${editingId}`, payload);
        toast.success("Product updated successfully! ✅", { id: toastId });
      } else {
        await axios.post("/products", payload);
        toast.success("Product added successfully! ✅", { id: toastId });
      }

      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(editingId ? "Failed to update product." : "Failed to add product.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const toastId = toast.loading("Deleting product...");
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Product removed from store.", { id: toastId });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.", { id: toastId });
    }
  };

  if (fetching) {
    return (
      <div className="ap-loader-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="ap-container animated-fade-in">
      <div className="ap-header">
        <h1>Manage Store Products</h1>
        <p>Add, review, edit, and remove premium resources from your storefront.</p>
      </div>

      <div className="ap-form-card">
        <h2 className="ap-form-title">
          {editingId ? <FaEdit /> : <FaPlus />} 
          {editingId ? " Edit Product" : " Add New Product"}
        </h2>

        <form className="ap-form" onSubmit={handleSubmit}>
          <div className="ap-form-grid">
            <div className="ap-input-group">
              <label>Product Title *</label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ap-input-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="notes">Notes</option>
                <option value="course">Course</option>
                <option value="roadmap">Roadmap</option>
                <option value="project">Project</option>
                <option value="code">Code</option>
              </select>
            </div>

            <div className="ap-input-group">
              <label>Price (₹) *</label>
              <input 
                name="price" 
                type="number" 
                value={form.price} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ap-input-group">
              <label>Thumbnail Image URL *</label>
              <input 
                name="image" 
                value={form.image} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="ap-input-group ap-full-width">
              <label>Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
              />
            </div>

            {form.category === "notes" && (
              <div className="ap-input-group ap-full-width">
                <label>Notion URL *</label>
                <input 
                  name="notionUrl" 
                  value={form.notionUrl} 
                  onChange={handleChange} 
                />
              </div>
            )}
          </div>

          <button type="submit" className="ap-btn-submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="ap-inventory-section">
        <h2><FaBoxOpen /> Current Inventory</h2>

        <div className="ap-product-grid">
          {products.map((p) => (
            <div key={p._id} className="ap-product-card">
              <img src={p.image} alt={p.title} />

              <h3>{p.title}</h3>

              <code>ID: {p._id}</code>

              {p.category === "notes" && (
                <a href={`https://gurukul.ialksng.me/learn/${p._id}`} target="_blank" rel="noreferrer">
                  Open in Gurukul ↗
                </a>
              )}

              <p>{p.price === 0 ? "FREE" : `₹${p.price}`}</p>

              <button onClick={() => handleEdit(p)}><FaEdit /></button>
              <button onClick={() => handleDelete(p._id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;