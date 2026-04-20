import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';
import { FaExternalLinkAlt } from 'react-icons/fa';
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
    <div className="gear-container animated-fade-in">
      <div className="gear-hero">
        <div className="gear-glow"></div>
        <h1 className="gear-title">
          My <span className="gear-title-highlight">Setup</span> & Gear
        </h1>
        <p className="gear-subtitle">
          A curated list of the hardware, software, and everyday carry items I use to build, design, and live.
        </p>
      </div>

      <div className="gear-content">
        {loading ? (
          <div className="gear-skeleton-grid">
            {[1, 2, 3, 4].map(n => <div key={n} className="gear-skeleton-card"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="gear-empty">No gear listed yet.</div>
        ) : (
          <div className="gear-grid">
            {products.map((product) => (
              <a 
                key={product._id} 
                href={product.externalLink} 
                target="_blank" 
                rel="noreferrer" 
                className="gear-card"
              >
                <div className="gear-card-header">
                  <span className="gear-badge">{product.category || 'Tech'}</span>
                  <div className="gear-link-icon"><FaExternalLinkAlt /></div>
                </div>
                
                <div className="gear-card-body">
                  <h3 className="gear-item-title">{product.name}</h3>
                  <p className="gear-item-desc">{product.description}</p>
                </div>
                
                <div className="gear-card-footer">
                  <span className="gear-action-text">View Product</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;