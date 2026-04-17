import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";

import { AuthContext } from "../../features/auth/AuthContext";
import { CartContext } from "../../features/cart/CartContext";

import logo from "../../core/assets/logo.png";

import "./Navbar.css";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
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
        <form className="nav__search-wrapper desktop-only" onSubmit={handleSearch}>
          <FaSearch className="nav__search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="nav__search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {!user ? (
          <button
            className="nav__btn desktop-only"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <div className="desktop-only navbar__user-area">
            {user.role !== "admin" && (
              <div className="icon__wrapper" onClick={() => navigate("/cart")}>
                <FaShoppingCart />
                {cart?.length > 0 && (
                  <span className="cart__badge">{cart.length}</span>
                )}
              </div>
            )}

            <div className="user__menu" ref={dropdownRef}>
              <div className="icon__wrapper" onClick={() => setOpen(!open)}>
                <FaUser />
              </div>

              {open && (
                <div className="dropdown__menu">
                  {user.role !== "admin" ? (
                    <>
                      <div
                        className="dropdown__item"
                        onClick={() => handleNavigate("/my-purchases")}
                      >
                        My Purchases
                      </div>
                      <div
                        className="dropdown__item"
                        onClick={() => handleNavigate("/profile")}
                      >
                        Profile
                      </div>
                      <div
                        className="dropdown__item"
                        onClick={() => handleNavigate("/settings")}
                      >
                        Settings
                      </div>
                    </>
                  ) : (
                    <div
                      className="dropdown__item"
                      onClick={() => handleNavigate("/admin")}
                    >
                      Admin Panel
                    </div>
                  )}

                  <div
                    className="dropdown__item logout"
                    onClick={() => {
                      if (window.confirm("Logout?")) {
                        logoutUser();
                        setOpen(false);
                      }
                    }}
                  >
                    Logout
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
          <form
            className="nav__search-wrapper"
            onSubmit={handleSearch}
            style={{ width: "100%" }}
          >
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

          {!user ? (
            <li className="mobile__login">
              <button className="nav__btn" onClick={() => handleNavigate("/login")}>
                Login
              </button>
            </li>
          ) : (
            <>
              {user.role !== "admin" && (
                <>
                  <li onClick={() => handleNavigate("/cart")} className="mobile__action">
                    🛒 Cart ({cart?.length || 0})
                  </li>
                  <li onClick={() => handleNavigate("/my-purchases")} className="mobile__action">
                    📦 My Purchases
                  </li>
                  <li onClick={() => handleNavigate("/profile")} className="mobile__action">
                    👤 Profile
                  </li>
                  <li onClick={() => handleNavigate("/settings")} className="mobile__action">
                    ⚙️ Settings
                  </li>
                </>
              )}

              {user.role === "admin" && (
                <li
                  onClick={() => handleNavigate("/admin")}
                  className="mobile__action mobile__admin"
                >
                  👑 Admin Panel
                </li>
              )}

              <li
                onClick={() => {
                  if (window.confirm("Logout?")) {
                    logoutUser();
                    setMenuOpen(false);
                  }
                }}
                className="mobile__action mobile__logout"
              >
                🚪 Logout
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;