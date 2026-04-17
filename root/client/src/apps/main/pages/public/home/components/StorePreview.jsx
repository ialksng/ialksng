import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';

import './StorePreview.module.css';

export default function StorePreview() {
  const previewProducts = [
    {
      title: "Ultimate MERN Authentication Boilerplate",
      price: "$15.00",
      tag: "Source Code",
      imageText: "Auth Boilerplate"
    },
    {
      title: "Data Structures & Algorithms Notes",
      price: "Free",
      tag: "Study Material",
      imageText: "DSA Notes"
    },
    {
      title: "React UI Components Library",
      price: "$20.00",
      tag: "UI Kit",
      imageText: "Component Library"
    }
  ];

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

        <div className="store__preview-grid">
          {previewProducts.map((product, index) => (
            <div className="store__product-card" key={index}>
              <div className="product__image-dummy">
                <span>[ {product.imageText} ]</span>
              </div>
              <div className="product__info">
                <span className="product__tag">{product.tag}</span>
                <h3 className="product__title">{product.title}</h3>
                <div className="product__price">{product.price}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}