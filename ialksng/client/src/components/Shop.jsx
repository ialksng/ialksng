import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/shop.css";
import Loader from "./Loader";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  // 🔹 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();

        const list = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        setProducts(list);
        setFiltered(list);
      } catch (err) {
        console.log("Product fetch error:", err);
        setProducts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  // 🔹 Fetch Owned Products
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        const ids = Array.isArray(data.orders)
          ? data.orders.map(o => o.product?._id).filter(Boolean)
          : [];

        setOwnedProducts(ids);
      } catch (err) {
        console.log("Orders fetch error:", err);
      }
    };

    fetchOrders();
  }, [user, API]);

  // 🔹 Filter Logic
  useEffect(() => {
    let temp = Array.isArray(products) ? [...products] : [];

    if (activeCategory !== "all") {
      temp = temp.filter(
        p => (p.category || "").toLowerCase() === activeCategory
      );
    }

    if (search.trim() !== "") {
      temp = temp.filter(p =>
        (p.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, activeCategory, products]);

  // 🔹 Add to Cart (IMPROVED)
  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/shop" } });
      return;
    }

    // ✅ Prevent duplicate
    const alreadyInCart = cart.some(item => item._id === product._id);
    if (alreadyInCart) {
      toast("Already in cart ⚠️");
      return;
    }

    addToCart(product);
    setAddedId(product._id);
    toast.success("Added to cart 🛒");

    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="shop-section">
      <div className="shop-container">

        {/* HEADER */}
        <div className="shop-header">
          <h2>Explore Resources</h2>
          {/* ✅ Explicitly mentioned product types for Razorpay compliance */}
          <p>Portfolio website services, premium code, AI tools access, and design templates.</p>
        </div>

        {/* TABS */}
        <div className="shop-tabs">
          {["all", "notes", "roadmap", "project", "code"].map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="shop-controls">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* PRODUCTS */}
        <div className="shop-grid">
          {Array.isArray(filtered) && filtered.length > 0 ? (
            filtered.map(product => (
              <div className="shop-card" key={product._id}>

                {/* IMAGE */}
                <div className="card-left">
                  <img
                    src={product.image || "/default-product.png"}
                    alt={product.title || "product"}
                  />
                </div>

                {/* CONTENT */}
                <div className="card-right">
                  <h3>{product.title || "Untitled"}</h3>
                  <p>{product.description || "No description"}</p>

                  <div className="tags">
                    <span>{product.category || "general"}</span>
                    {product.price === 0 && <span className="free">Free</span>}
                  </div>

                  <div className="card-actions">

                    {/* PREVIEW */}
                    <button
                      className="btn preview-btn"
                      onClick={() => setPreviewProduct(product)}
                    >
                      Preview
                    </button>

                    {/* VIEW / BUY */}
                    {ownedProducts.includes(product._id) ? (
                      <button
                        className="btn view-btn"
                        onClick={() => navigate(`/access/${product._id}`)}
                      >
                        View
                      </button>
                    ) : product.price === 0 ? (
                      <button
                        className="btn view-btn"
                        onClick={() => navigate(`/access/${product._id}`)}
                      >
                        View
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <button
                          className={`btn buy-btn ${
                            addedId === product._id ? "added" : ""
                          }`}
                          onClick={() => handleAddToCart(product)}
                          disabled={addedId === product._id}
                        >
                          {addedId === product._id
                            ? "Added ✓"
                            : `Buy ₹${product.price || 0}`}
                        </button>
                        {/* ✅ Added Delivery Time text for Razorpay compliance */}
                        <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
                          ⚡ Instant delivery to your account
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="empty-state">
              No products found.
            </div>
          )}
        </div>

        {/* PREVIEW MODAL */}
        {previewProduct && (
          <div
            className="preview-modal"
            onClick={() => setPreviewProduct(null)} // ✅ close on outside
          >
            <div
              className="preview-box"
              onClick={(e) => e.stopPropagation()} // ✅ prevent close inside
            >
              <button
                className="close-btn"
                onClick={() => setPreviewProduct(null)}
              >
                ✕
              </button>

              <img
                src={
                  previewProduct.previewImage ||
                  previewProduct.image ||
                  "/default-product.png"
                }
                alt=""
              />

              <h3>{previewProduct.title}</h3>
              <p>{previewProduct.description}</p>

              {previewProduct.previewUrl && (
                <a
                  href={previewProduct.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Preview →
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default Shop;