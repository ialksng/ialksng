import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../../../../../core/utils/axios';

import { CartContext } from '../../../../../../features/cart/CartContext';
import { AuthContext } from '../../../../../../features/auth/AuthContext';
import Pagination from '../../../../../../core/components/Pagination';

import '../../../../../store/Store.css'; 
import './StorePreview.css';

export default function StorePreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
        // Keep all products for pagination
        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
            <div className="shop-grid" style={{ marginTop: '2rem' }}>
              {displayedProducts.map(product => (
                <div className="shop-card" key={product._id}>
                  <div className="card-left">
                    <img src={product.image || "/default-product.png"} alt={product.title || "product"} />
                  </div>
                  <div className="card-right">
                    <h3>{product.title || "Untitled"}</h3>
                    <p>{product.description || "No description"}</p>

                    <div className="tags">
                      <span>{product.category || "general"}</span>
                      {product.price === 0 && <span className="free">Free</span>}
                    </div>

                    <div className="card-actions">
                      <button className="btn preview-btn" onClick={() => navigate('/store')}>
                        View Details
                      </button>

                      {product.price === 0 ? (
                        <button className="btn view-btn" onClick={() => navigate(`/access/${product._id}`)}>
                          Access Now
                        </button>
                      ) : (
                        <button
                          className={`btn buy-btn ${addedId === product._id ? "added" : ""}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={addedId === product._id}
                        >
                          {addedId === product._id ? "Added ✓" : `Buy ₹${product.price || 0}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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