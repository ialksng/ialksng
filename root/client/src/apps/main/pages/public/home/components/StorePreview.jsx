import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from '../../../../../../core/utils/axios';

import './StorePreview.css';

export default function StorePreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        
        // Fix: Access the 'products' array from inside the returned data object
        if (data.success && data.products) {
          setProducts(data.products.slice(0, 3));
        } else {
          setProducts([]);
        }
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
          <div className="store__preview-grid">
            {products.map((product) => (
              <div className="store__product-card" key={product._id}>
                
                {/* Fix: use product.image as defined in your Mongoose model */}
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0'}} 
                  />
                ) : (
                  <div className="product__image-dummy">
                    <span>[ {product.title} ]</span>
                  </div>
                )}
                
                <div className="product__info">
                  <span className="product__tag">{product.category || 'Digital'}</span>
                  <h3 className="product__title">{product.title}</h3>
                  <div className="product__price">
                    {product.price === 0 ? "Free" : `$${product.price}`}
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