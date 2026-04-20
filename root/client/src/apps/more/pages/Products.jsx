import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import { FaRocket, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/more/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="ecosystem-container animated-fade-in">
      <div className="ecosystem-hero">
        <div className="ecosystem-glow"></div>
        <h1 className="ecosystem-title">
          My <span className="ecosystem-title-highlight">Ecosystem</span>
        </h1>
        <p className="ecosystem-subtitle">
          A collection of platforms, applications, and digital experiences I've designed and engineered from the ground up.
        </p>
      </div>

      <div className="ecosystem-content">
        {loading ? (
          <div className="ecosystem-skeleton-grid">
            {[1, 2, 3].map(n => <div key={n} className="ecosystem-skeleton-card"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="ecosystem-empty">
            <FaCode className="empty-icon" />
            <p>No projects listed yet. Currently building something awesome!</p>
          </div>
        ) : (
          <div className="ecosystem-grid">
            {products.map((product) => (
              <div key={product._id} className="ecosystem-card">
                <div className="ecosystem-card-header">
                  <span className="ecosystem-badge">
                    <span className="live-dot"></span> 
                    {product.category || 'Live Platform'}
                  </span>
                  <a 
                    href={product.externalLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="launch-icon"
                    title="Launch App"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
                
                <div className="ecosystem-card-body">
                  <div className="app-icon-placeholder">
                    {/* Extracts the first letter of the product name to act as an app icon */}
                    {product.name ? product.name.charAt(0).toUpperCase() : <FaRocket />}
                  </div>
                  <h3 className="ecosystem-item-title">{product.name}</h3>
                  <p className="ecosystem-item-desc">{product.description}</p>
                </div>
                
                <div className="ecosystem-card-footer">
                  <a 
                    href={product.externalLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="ecosystem-action-btn"
                  >
                    <FaRocket /> Launch App
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;