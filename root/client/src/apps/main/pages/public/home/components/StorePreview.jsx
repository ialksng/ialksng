import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../../../core/utils/axios';
import './StorePreview.css';

const StorePreview = ({ heading }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get('/products'); 
        setProducts(res.data?.products?.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchLatestProducts();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="store-preview" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>{heading || "Digital Store"}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {products.map(product => (
          <div key={product._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={product.image || "https://via.placeholder.com/400"} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{product.title}</h3>
              <p style={{ color: 'var(--accent-primary)', fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px 0' }}>₹{product.price}</p>
              <Link to={`/store`} className="btn primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', margin: '40px auto 0 auto' }}>
        <Link to="/store" className="btn secondary">Browse Full Store</Link>
      </div>
    </section>
  );
};

export default StorePreview;