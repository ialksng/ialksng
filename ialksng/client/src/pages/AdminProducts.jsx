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

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // 🔹 fetch products
  const fetchProducts = () => {
    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;

    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchProducts();
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
        {products.map(p => (
          <div key={p._id} className="adminP__card">
            <img src={p.image} alt="" />

            <h3>{p.title}</h3>
            <p>₹{p.price}</p>

            <button onClick={() => handleDelete(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;