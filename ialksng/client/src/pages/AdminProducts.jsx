import { useEffect, useState } from "react";
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

  // ✅ FIX 1: fallback API
  const API =
    import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";

  const token = localStorage.getItem("token");

  // 🔹 fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();

      // ✅ FIX 2: safe handling
      setProducts(data.products || []);
    } catch (err) {
      console.log("Fetch products error:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API]);

  // 🔹 handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 add product
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product added ✅");
        setForm({
          title: "",
          description: "",
          price: "",
          image: "",
          fileUrl: ""
        });
        fetchProducts();
      } else {
        alert(data.msg || "Failed to add product");
      }

    } catch (err) {
      console.log("Add product error:", err);
    }
  };

  // 🔹 delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchProducts();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="adminP__container">
      <h2>Manage Products</h2>

      {/* 🔥 ADD FORM */}
      <div className="adminP__form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="fileUrl" placeholder="File URL" value={form.fileUrl} onChange={handleChange} />

        <button onClick={handleAdd}>Add Product</button>
      </div>

      {/* 🔥 PRODUCT LIST */}
      <div className="adminP__list">
        {products.length === 0 ? (
          <p style={{ color: "white" }}>No products found</p>
        ) : (
          products.map(p => (
            <div key={p._id} className="adminP__card">
              <img src={p.image} alt="" />

              <h3>{p.title}</h3>
              <p>₹{p.price}</p>

              <button onClick={() => handleDelete(p._id)}>
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