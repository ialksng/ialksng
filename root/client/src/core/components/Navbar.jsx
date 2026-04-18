import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import axios from "../utils/axios";

import { AuthContext } from "../../features/auth/AuthContext";
import { CartContext } from "../../features/cart/CartContext";

import NotificationBell from "../components/NotificationBell";

import logo from "../../core/assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (url) => {
    navigate(url);
    setSearchQuery("");
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <img
        src={logo}
        alt="Alok Singh Logo"
        className="navbar__logo"
        onClick={() => navigate("/")}
      />

      <nav className="navbar__links desktop-only">
        <ul>
          <li><NavLink to="/" className="nav__link">Home</NavLink></li>
          <li><NavLink to="/about" className="nav__link">About</NavLink></li>
          <li><NavLink to="/work" className="nav__link">Work</NavLink></li>
          <li><NavLink to="/blog" className="nav__link">Blog</NavLink></li>
          <li><NavLink to="/store" className="nav__link">Store</NavLink></li>
          <li><NavLink to="/contact" className="nav__link">Contact</NavLink></li>
          <li><NavLink to="/more" className="nav__link">More</NavLink></li>
        </ul>
      </nav>

      <div className="navbar__actions">
        <div className="nav__search-container desktop-only" ref={searchRef}>
          <form className="nav__search-wrapper" onSubmit={handleSearchSubmit}>
            <FaSearch className="nav__search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="nav__search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </form>

          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="search-suggestions__dropdown">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="suggestion__item"
                    onClick={() => handleSuggestionClick(item.url)}
                  >
                    <span className="suggestion__title">{item.title}</span>
                    <span className={`suggestion__badge type-${item.type}`}>
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="suggestion__empty">No results found</div>
              )}
            </div>
          )}
        </div>

        <NotificationBell /> {/* ✅ now safe */}

        {!user ? (
          <button className="nav__btn desktop-only" onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <div className="desktop-only navbar__user-area">
            {user.role !== "admin" && (
              <div className="icon__wrapper" onClick={() => navigate("/cart")}>
                <FaShoppingCart />
                {cart?.length > 0 && <span className="cart__badge">{cart.length}</span>}
              </div>
            )}

            <div className="user__menu" ref={dropdownRef}>
              <div className="icon__wrapper" onClick={() => setOpen(!open)}>
                <FaUser />
              </div>

              {open && (
                <div className="dropdown__menu">
                  {user.role !== "admin" && (
                    <div className="dropdown__item" onClick={() => handleNavigate("/profile")}>
                      👤 Profile
                    </div>
                  )}

                  {user.role === "admin" && (
                    <div className="dropdown__item" onClick={() => handleNavigate("/admin")}>
                      👑 Admin Panel
                    </div>
                  )}

                  <div
                    className="dropdown__item logout"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        logoutUser();
                        setOpen(false);
                      }
                    }}
                  >
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      <nav className={`mobile__menu ${menuOpen ? "active" : ""}`}>
        <div className="mobile__search-container">
          <form className="nav__search-wrapper" onSubmit={handleSearchSubmit} style={{ width: "100%" }}>
            <FaSearch className="nav__search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="nav__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <ul>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/" className="nav__link">Home</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/about" className="nav__link">About</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/work" className="nav__link">Work</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/blog" className="nav__link">Blog</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/store" className="nav__link">Store</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/contact" className="nav__link">Contact</NavLink></li>
          <li onClick={() => setMenuOpen(false)}><NavLink to="/more" className="nav__link">More</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;