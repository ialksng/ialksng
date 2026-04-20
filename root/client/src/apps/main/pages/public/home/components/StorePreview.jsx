import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../../../../../core/utils/axios';

import { CartContext } from '../../../../../../features/cart/CartContext';
import { AuthContext } from '../../../../../../features/auth/AuthContext';
import Pagination from '../../../../../../core/components/Pagination';

import '../../../../../store/Store.css'; // Ensuring the new store card styles are applied
import './StorePreview.css';

export default function StorePreview() {
  const [products, setProducts] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Owned Products (Access Logic)
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/my-orders');
        const ids = Array.isArray(data.orders) ? data.orders.map(o => o.product?._id).filter(Boolean) : [];
        setOwnedProducts(ids);
      } catch (err) {
        console.log("Orders fetch error:", err);
      }
    };
    fetchOrders();
  }, [user]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

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

  const handleBuyNow = (product) => {
    if (!user) {
      navigate("/login", { state: { from: `/checkout/${product._id}` } });
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  const handleAccess = () => {
    window.location.href = "https://gurukul.ialksng.me/";
  };

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="home__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        
        <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Digital Store</h2>
            <p>Premium developer resources, boilerplates, and study materials.</p>
          </div>
          <Link to="/store" className="view__all-btn" style={{ color: 'var(--success-color)' }}>
            Visit Store <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Products...</div>
        ) : products.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '2rem' }}>No products available currently.</div>
        ) : (
          <>
            <div className="store-grid" style={{ marginTop: '2rem' }}>
              {displayedProducts.map(product => {
                // ADMIN BYPASS LOGIC HERE
                const isAdmin = user && user.role === "admin";
                const isOwned = ownedProducts.includes(product._id);
                const isFree = product.price === 0;
                const hasAccess = isAdmin || isOwned || isFree;

                return (
                  <div className="store-card" key={product._id}>
                    <div className="card-image-wrapper" onClick={() => navigate('/store')}>
                      <img src={product.image || "/default-product.png"} alt={product.title || "product"} />
                      <div className="card-quickview"><span>View in Store</span></div>
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

            <div style={{ marginTop: '2rem' }}>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </>
        )}

      </div>
    </section>
  );
}