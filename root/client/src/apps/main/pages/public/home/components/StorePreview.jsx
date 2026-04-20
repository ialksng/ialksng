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
        // Show the top 3 most recent products
        setProducts(data.slice(0, 3));
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
              <div className="store__product-card" key={product._id || product.id}>
                {product.imageUrl || product.thumbnail ? (
                  <img src={product.imageUrl || product.thumbnail} alt={product.title || product.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0'}} />
                ) : (
                  <div className="product__image-dummy">
                    <span>[ {product.title || product.name} ]</span>
                  </div>
                )}
                
                <div className="product__info">
                  <span className="product__tag">{product.tag || product.category || 'Digital'}</span>
                  {/* Handle if your DB uses "name" instead of "title" */}
                  <h3 className="product__title">{product.title || product.name}</h3>
                  <div className="product__price">
                    {/* Handle free vs paid formatting dynamically based on your backend logic */}
                    {product.price === 0 || product.price === "0" ? "Free" : `$${product.price}`}
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