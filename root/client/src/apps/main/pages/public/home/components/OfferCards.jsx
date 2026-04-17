import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaCode, FaShoppingCart } from 'react-icons/fa';

export default function OfferCards() {
  return (
    <section className="home__section">
      <div className="section__header">
        <h2>What Are You Looking For?</h2>
        <p>Choose your path to see how I can help you achieve your goals.</p>
      </div>

      <div className="grid__container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

        <div className="card" style={{ textAlign: "center", alignItems: "center" }}>
          <FaBriefcase style={{ fontSize: "2.5rem", color: "var(--accent-primary)", marginBottom: "1rem" }} />
          <h3 className="card__title">For Hiring</h3>
          <p className="card__desc">
            Looking to add a skilled MERN stack developer and competitive programmer to your team? Check out my resume and tech stack.
          </p>
          <Link to="/about" className="nav__btn" style={{ width: "100%" }}>View Profile</Link>
        </div>

        <div className="card" style={{ textAlign: "center", alignItems: "center" }}>
          <FaCode style={{ fontSize: "2.5rem", color: "var(--success-color)", marginBottom: "1rem" }} />
          <h3 className="card__title">For Clients</h3>
          <p className="card__desc">
            Need a custom web application, MVP, or cloud architecture? Let's build a fast, scalable solution for your business.
          </p>
          <Link to="/contact" className="nav__btn" style={{ width: "100%", backgroundColor: "var(--success-color)", color: "#fff" }}>Hire Me</Link>
        </div>

        <div className="card" style={{ textAlign: "center", alignItems: "center" }}>
          <FaShoppingCart style={{ fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "1rem" }} />
          <h3 className="card__title">For Buyers</h3>
          <p className="card__desc">
            Want to speed up your development? Browse my store for premium MERN templates, boilerplates, and developer resources.
          </p>
          <Link to="/store" className="nav__btn" style={{ width: "100%", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>Visit Store</Link>
        </div>

      </div>
    </section>
  );
}