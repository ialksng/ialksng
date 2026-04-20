import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from '../../../../../../core/utils/axios';

// Import your exact Store CSS so the cards look identical
import '../../../../../store/Store.css'; 
import './StorePreview.css';

export default function StorePreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        
        // Use the exact same data checking logic from your Store.jsx
        const list = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];
          
        // Show the top 3 items
        setProducts(list.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          
          /* Replaced preview grid with your exact Store.jsx grid classes */
          <div className="shop-grid" style={{ marginTop: '2rem' }}>
            {products.map(product => (
              <div className="shop-card" key={product._id}>
                <div className="card-left">
                  <img
                    src={product.image || "/default-product.png"}
                    alt={product.title || "product"}
                  />
                </div>
                <div className="card-right">
                  <h3>{product.title || "Untitled"}</h3>
                  <p>{product.description || "No description"}</p>

                  <div className="tags">
                    <span>{product.category || "general"}</span>
                    {product.price === 0 && <span className="free">Free</span>}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn preview-btn"
                      onClick={() => navigate('/store')}
                    >
                      View in Store
                    </button>

                    {product.price === 0 ? (
                      <button
                        className="btn view-btn"
                        onClick={() => navigate(`/access/${product._id}`)}
                      >
                        Access Now
                      </button>
                    ) : (
                      <button
                        className="btn buy-btn"
                        onClick={() => navigate(`/store`)}
                      >
                        Buy ₹{product.price || 0}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
    </section>
  );
}