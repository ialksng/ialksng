import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUserTie, FaBox, FaPenNib, FaBriefcase, FaCertificate, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2>Control Panel</h2>
      </div>

      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaHome className="admin-nav__icon" /> Dashboard
        </NavLink>
        
        <div className="admin-nav__section">Pages</div>
        
        <NavLink to="/admin/home" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaHome className="admin-nav__icon" /> Manage Home
        </NavLink>
        
        <NavLink to="/admin/about" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaUserTie className="admin-nav__icon" /> Manage About
        </NavLink>

        <div className="admin-nav__section">Content</div>

        <NavLink to="/admin/products" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaBox className="admin-nav__icon" /> Products / Store
        </NavLink>

        <NavLink to="/admin/blog" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaPenNib className="admin-nav__icon" /> Blog Posts
        </NavLink>

        <NavLink to="/admin/projects" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaBriefcase className="admin-nav__icon" /> Projects
        </NavLink>

        <NavLink to="/admin/certifications" className={({ isActive }) => isActive ? "admin-nav__link active" : "admin-nav__link"}>
          <FaCertificate className="admin-nav__icon" /> Certifications
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