import { useEffect, useState } from "react";
import axios from "../utils/axios"; // ✅ Using your configured axios instance
import "../styles/adminproducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    fileUrl: ""
  });
  const [loading, setLoading] = useState(false);

  // 🔹 fetch products
  const fetchProducts = async () => {
    try {
      // Using relative path because axios instance has the base URL
      const res = await axios.get("/products");
      
      // ✅ Handle data normalization based on your controller response
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

  // 🔹 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure price is handled correctly if needed, otherwise keep as string for input
    setForm({ ...form, [name]: value });
  };

  // 🔹 add product
  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.title || !form.price || !form.image) {
        return alert("Please fill in Title, Price, and Image URL");
    }

    setLoading(true);
    try {
      // ✅ Axios automatically includes the token from your interceptor in utils/axios.js
      const res = await axios.post("/products", {
        ...form,
        price: Number(form.price) // Ensure price is sent as a number
      });

      if (res.data) {
        alert("Product added ✅");
        setForm({
          title: "",
          description: "",
          price: "",
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

  // 🔹 delete product
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

      {/* 🔥 ADD FORM */}
      <form className="adminP__form" onSubmit={handleAdd}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <input name="fileUrl" placeholder="File URL (for digital access)" value={form.fileUrl} onChange={handleChange} />

        <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* 🔥 PRODUCT LIST */}
      <div className="adminP__list">
        {products.length === 0 ? (
          <p style={{ color: "white" }}>No products found</p>
        ) : (
          products.map(p => (
            <div key={p._id} className="adminP__card">
              <img src={p.image} alt={p.title} />
              <div className="adminP__card-info">
                <h3>{p.title}</h3>
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