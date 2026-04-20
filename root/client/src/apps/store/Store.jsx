import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../../features/cart/CartContext";
import { AuthContext } from "../../features/auth/AuthContext";
import Loader from "../../core/components/Loader";
import Pagination from "../../core/components/Pagination";

import "./Store.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
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

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        const ids = Array.isArray(data.orders) ? data.orders.map(o => o.product?._id).filter(Boolean) : [];
        setOwnedProducts(ids);
      } catch (err) {
        console.log("Orders fetch error:", err);
      }
    };
    fetchOrders();
  }, [user, API]);

  useEffect(() => {
    let temp = Array.isArray(products) ? [...products] : [];

    if (activeCategory !== "all") {
      temp = temp.filter(p => (p.category || "").toLowerCase() === activeCategory);
    }

    if (search.trim() !== "") {
      temp = temp.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()));
    }

    if (sortOrder === "low-high") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "high-low") {
      temp.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFiltered(temp);
    setCurrentPage(1); 
  }, [search, activeCategory, sortOrder, products]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/store" } });
      return;
    }

    const alreadyInCart = cart.some(item => item._id === product._id);
    if (alreadyInCart) {
      toast("Item is already in your cart ⚠️");
      return;
    }

    addToCart(product);
    setAddedId(product._id);
    toast.success("Added to cart 🛒");
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      navigate("/login", { state: { from: `/checkout/${product._id}` } });
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  const handleAccess = () => {
    window.location.href = "https://gurukul.ialksng.com";
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="store-loader">
         <Loader />
      </div>
    );
  }

  return (
    <section className="store-section container">
      {/* Header Bar */}
      <div className="store-topbar">
        <div className="store-topbar-left">
          <h2>Resource Store</h2>
          <p>Premium code, tools, and design templates.</p>
        </div>
        <div className="store-topbar-right">
          <input
            type="text"
            placeholder="Search for products, codes, templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="store-search"
          />
        </div>
      </div>

      <div className="store-layout">
        {/* Sidebar Filters */}
        <aside className="store-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <h4>Categories</h4>
            <ul className="filter-list">
              {["all", "notes", "roadmap", "project", "code"].map(cat => (
                <li key={cat}>
                  <button
                    className={activeCategory === cat ? "active" : ""}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4>Sort By Price</h4>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="store-select"
            >
              <option value="default">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="store-main">
          {Array.isArray(displayedProducts) && displayedProducts.length > 0 ? (
            <div className="store-grid">
              {displayedProducts.map(product => {
                // ADMIN BYPASS LOGIC HERE
                const isAdmin = user && user.role === "admin";
                const isOwned = ownedProducts.includes(product._id);
                const isFree = product.price === 0;
                const hasAccess = isAdmin || isOwned || isFree;

                return (
                  <div className="store-card" key={product._id}>
                    <div className="card-image-wrapper" onClick={() => setPreviewProduct(product)}>
                      <img src={product.image || "/default-product.png"} alt={product.title} />
                      <div className="card-quickview"><span>Quick View</span></div>
                      {isFree && <span className="badge-free">FREE</span>}
                    </div>

                    <div className="card-content">
                      <span className="card-category">{product.category || "General"}</span>
                      <h3 className="card-title" title={product.title}>{product.title || "Untitled"}</h3>
                      
                      <div className="card-rating">
                        ★★★★☆ <span>({Math.floor(Math.random() * 500) + 50})</span>
                      </div>

                      <div className="card-bottom">
                        <div className="card-price-row">
                          <span className="price-main">₹{product.price || 0}</span>
                          {product.price > 0 && (
                            <span className="price-strike">₹{Math.floor(product.price * 1.4)}</span>
                          )}
                        </div>

                        <div className="card-actions-col">
                          {hasAccess ? (
                            <button className="btn-access" onClick={handleAccess}>
                              Access Now
                            </button>
                          ) : (
                            <>
                              <button
                                className={`btn-cart ${addedId === product._id ? "added" : ""}`}
                                onClick={() => handleAddToCart(product)}
                                disabled={addedId === product._id}
                              >
                                {addedId === product._id ? "Added to Cart ✓" : "Add to Cart"}
                              </button>
                              <button className="btn-buy" onClick={() => handleBuyNow(product)}>
                                Buy Now
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="store-empty">
              <p>No products found matching your criteria.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                Clear filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="store-pagination">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {previewProduct && (
        <div className="preview-modal" onClick={() => setPreviewProduct(null)}>
          <div className="preview-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPreviewProduct(null)}>✕</button>
            <div className="preview-layout">
              <div className="preview-image-side">
                <img src={previewProduct.previewImage || previewProduct.image || "/default-product.png"} alt={previewProduct.title} />
              </div>
              <div className="preview-info-side">
                <span className="preview-cat">{previewProduct.category}</span>
                <h3>{previewProduct.title}</h3>
                <p className="preview-desc">{previewProduct.description || "No description available."}</p>
                
                <div className="preview-footer">
                  <span className="preview-price">₹{previewProduct.price}</span>
                  {previewProduct.previewUrl && (
                    <a href={previewProduct.previewUrl} target="_blank" rel="noreferrer" className="preview-link">
                      Live Preview <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Shop;