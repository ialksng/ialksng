import "../styles/navbar.css";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <header className="navbar">
      
      <span className="navbar_logo" onClick={() => navigate("/")}>
        Alok Singh
      </span>

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`navbar_links ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          </li>
          <li>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          </li>
          <li>
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          </li>

          <li>
            <span onClick={() => handleNavigate("/shop")}>
              Shop
            </span>
          </li>

          <li>
            <a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </li>
        </ul>
      </nav>

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

            {user.role !== "admin" && (
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart className="icon" />

                {cart.length > 0 && (
                  <span className="cart-count">
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            <div className="user-menu" ref={dropdownRef}>
              <FaUser
                className="icon"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="dropdown">

                  {user.role !== "admin" && (
                    <p onClick={() => handleNavigate("/my-purchases")}>
                      My Purchases
                    </p>
                  )}

                  {user.role === "admin" && (
                    <p onClick={() => handleNavigate("/admin")}>
                      Admin Panel
                    </p>
                  )}

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