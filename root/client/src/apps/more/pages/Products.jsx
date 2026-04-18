import React, { useState, useEffect } from 'react';
import axios from '../../../core/utils/axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/more/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="more-layout container">
      <div className="sub-page-header">
        <h1>Products & Gear</h1>
        <p>Curated recommendations of tech and tools I use.</p>
      </div>
      <div className="more-grid">
        {products.map(product => (
          <a key={product._id} href={product.externalLink} target="_blank" rel="noreferrer" className="more-card">
            <span className="more-card-badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>{product.category}</span>
            <h3 className="more-card-title">{product.name}</h3>
            <p className="more-card-desc">{product.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Products;