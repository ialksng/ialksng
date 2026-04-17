import React from 'react';
import { FaHeadphones, FaGamepad, FaMobileAlt, FaLaptop } from 'react-icons/fa';

import './FunExtras.module.css';

export default function FunExtras() {
  return (
    <section className="home__section" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        <div className="section__header">
          <h2>Beyond the Terminal</h2>
          <p>A quick look at my daily setup and off-screen activities.</p>
        </div>

        <div className="bento__grid">
          <div className="bento__card">
            <FaHeadphones className="bento__icon" />
            <h3 className="bento__title">On Repeat</h3>
            <p className="bento__value">Shubh & Karan Aujla</p>
          </div>
          
          <div className="bento__card">
            <FaGamepad className="bento__icon" />
            <h3 className="bento__title">Currently Playing</h3>
            <p className="bento__value">Minecraft & Clash of Clans</p>
          </div>
          
          <div className="bento__card">
            <div style={{ display: 'flex', gap: '15px' }}>
              <FaLaptop className="bento__icon" />
              <FaMobileAlt className="bento__icon" />
            </div>
            <h3 className="bento__title">Daily Drivers</h3>
            <p className="bento__value">Lenovo LOQ & Nothing Phone (1)</p>
          </div>
        </div>
      </div>
    </section>
  );
}