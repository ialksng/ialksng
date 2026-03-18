import { useEffect, useState } from "react";
import axios from "../utils/axios"; 
import "../styles/adminproducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "notes", // ✅ Added category with a default value from your enum
    image: "",
    fileUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      const data = res.data;
      setProducts(data.products || data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
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
    
    // ✅ Validation updated to include category
    if (!form.title || !form.price || !form.image || !form.category) {
        return alert("Please fill in Title, Price, Category, and Image URL");
    }

    setLoading(true);
    try {
      const res = await axios.post("/products", {
        ...form,
        price: Number(form.price) 
      });

      if (res.data) {
        alert("Product added ✅");
        setForm({
          title: "",
          description: "",
          price: "",
          category: "notes", // Reset to default
          image: "",
          fileUrl: ""
        });
        fetchProducts();
      }
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await axios.delete(`/products/${id}`);
      alert("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="adminP__container">
      <h2>Manage Products</h2>

      <form className="adminP__form" onSubmit={handleAdd}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        
        {/* ✅ Added Category Dropdown matching your Mongoose Enum */}
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="notes">Notes</option>
          <option value="roadmap">Roadmap</option>
          <option value="project">Project</option>
          <option value="code">Code</option>
        </select>

        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <input name="fileUrl" placeholder="File URL (for digital access)" value={form.fileUrl} onChange={handleChange} />

        <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div className="adminP__list">
        {products.length === 0 ? (
          <p style={{ color: "white" }}>No products found</p>
        ) : (
          products.map(p => (
            <div key={p._id} className="adminP__card">
              <img src={p.image} alt={p.title} />
              <div className="adminP__card-info">
                <h3>{p.title}</h3>
                {/* ✅ Display Category in the list */}
                <span className="adminP__category-tag">{p.category}</span>
                <p>₹{p.price}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminProducts;