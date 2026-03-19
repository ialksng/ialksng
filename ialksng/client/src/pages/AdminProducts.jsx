import { useEffect, useState } from "react";
import axios from "../utils/axios"; 
import "../styles/adminproducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "notes",
    image: "",
    fileUrl: "",
    notionPageId: ""   // 🔥 FIX: added here
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.products || res.data || []);
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

    // 🔥 Better validation
    if (!form.title || !form.price || !form.image || !form.category) {
      return alert("Fill required fields");
    }

    // 🔥 If category = notes → notionPageId required
    if (form.category === "notes" && !form.notionPageId) {
      return alert("Please add Notion Page ID for notes");
    }

    setLoading(true);

    try {
      const res = await axios.post("/products", {
        ...form,
        price: Number(form.price)
      });

      if (res.data) {
        alert("Product added ✅");

        // 🔥 RESET FORM
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
      alert("Failed to add product");
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
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="adminP__container">
      <h2>Manage Products</h2>

      <form className="adminP__form" onSubmit={handleAdd}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="notes">Notes</option>
          <option value="roadmap">Roadmap</option>
          <option value="project">Project</option>
          <option value="code">Code</option>
        </select>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        {/* 🔥 Show File URL ONLY if NOT notes */}
        {form.category !== "notes" && (
          <input
            name="fileUrl"
            placeholder="File URL (download)"
            value={form.fileUrl}
            onChange={handleChange}
          />
        )}

        {/* 🔥 Show Notion field ONLY for notes */}
        {form.category === "notes" && (
          <input
            name="notionPageId"
            placeholder="Notion Page ID"
            value={form.notionPageId}
            onChange={handleChange}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div className="adminP__list">
        {products.length === 0 ? (
          <p style={{ color: "white" }}>No products found</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="adminP__card">
              <img src={p.image} alt={p.title} />

              <div className="adminP__card-info">
                <h3>{p.title}</h3>
                <span className="adminP__category-tag">{p.category}</span>
                <p>₹{p.price}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(p._id)}
              >
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