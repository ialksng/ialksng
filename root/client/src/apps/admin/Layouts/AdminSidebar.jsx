import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUserTie,
  FaBox,
  FaPenNib,
  FaBriefcase,
  FaCertificate,
  FaSignOutAlt,
  FaStar,
  FaGamepad,
  FaBroadcastTower,
  FaHeart
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `admin-nav__link ${isActive ? 'active' : ''}`;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2>Control Panel</h2>
      </div>

      <nav className="admin-sidebar__nav">

        <NavLink to="/admin" end className={linkClass}>
          <FaHome className="admin-nav__icon" /> Dashboard
        </NavLink>

        <div className="admin-nav__section">Pages</div>

        <NavLink to="/admin/home" className={linkClass}>
          <FaHome className="admin-nav__icon" /> Manage Home
        </NavLink>

        <NavLink to="/admin/about" className={linkClass}>
          <FaUserTie className="admin-nav__icon" /> Manage About
        </NavLink>

        <div className="admin-nav__section">Content</div>

        <NavLink to="/admin/products" className={linkClass}>
          <FaBox className="admin-nav__icon" /> Products / Store
        </NavLink>

        <NavLink to="/admin/blog" className={linkClass}>
          <FaPenNib className="admin-nav__icon" /> Blog Posts
        </NavLink>

        <NavLink to="/admin/testimonials" className={linkClass}>
          <FaStar className="admin-nav__icon" /> Testimonials
        </NavLink>

        <NavLink to="/admin/newsletter" className={linkClass}>
          <FaPenNib className="admin-nav__icon" /> Newsletter
        </NavLink>

        <NavLink to="/admin/projects" className={linkClass}>
          <FaBriefcase className="admin-nav__icon" /> Projects
        </NavLink>

        <NavLink to="/admin/certifications" className={linkClass}>
          <FaCertificate className="admin-nav__icon" /> Certifications
        </NavLink>

        <div className="admin-nav__section">More Section</div>

        <NavLink to="/admin/streams" className={linkClass}>
          <FaBroadcastTower className="admin-nav__icon" /> Live & Streams
        </NavLink>

        <NavLink to="/admin/gamezone" className={linkClass}>
          <FaGamepad className="admin-nav__icon" /> GameZone
        </NavLink>

        <NavLink to="/admin/gear" className={linkClass}>
          <FaBox className="admin-nav__icon" /> Gear & Products
        </NavLink>

        <NavLink to="/admin/life" className={linkClass}>
          <FaHeart className="admin-nav__icon" /> Life Updates
        </NavLink>

      </nav>

      <div className="admin-sidebar__footer">
        <NavLink to="/" className="admin-nav__link return-home">
          <FaSignOutAlt className="admin-nav__icon" /> Exit to Site
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;