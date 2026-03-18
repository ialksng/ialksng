import "../styles/navbar.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // 🔹 close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 helper
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="navbar">
      
      {/* LOGO */}
      <span className="navbar_logo" onClick={() => navigate("/")}>
        Alok Singh
      </span>

      {/* LINKS */}
      <nav className="navbar_links">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>    

          {/* ✅ FIXED SHOP BUTTON */}
          <li>
            <span
              onClick={() => navigate("/shop")}
              style={{ cursor: "pointer" }}
            >
              Shop
            </span>
          </li>

          <li><a href="#blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ACTIONS */}
      <div className="navbar_actions">

        {!user ? (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <>
            {/* 🛒 USER ONLY */}
            {user.role !== "admin" && (
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart className="icon" />

                {/* 🔥 CART COUNT */}
                {cart.length > 0 && (
                  <span className="cart-count">
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            {/* 👤 User Menu */}
            <div className="user-menu" ref={dropdownRef}>
              <FaUser
                className="icon"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="dropdown">

                  {/* 👤 USER */}
                  {user.role !== "admin" && (
                    <p onClick={() => handleNavigate("/my-purchases")}>
                      My Purchases
                    </p>
                  )}

                  {/* 👑 ADMIN */}
                  {user.role === "admin" && (
                    <p onClick={() => handleNavigate("/admin")}>
                      Admin Panel
                    </p>
                  )}

                  {/* 🚪 Logout */}
                  <p onClick={() => {
                    logoutUser();
                    setOpen(false);
                  }}>
                    Logout
                  </p>

                </div>
              )}
            </div>
          </>
        )}

      </div>

    </header>
  );
}

export default Navbar;