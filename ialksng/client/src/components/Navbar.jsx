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
  const [active, setActive] = useState("home");
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

  useEffect(() => {
    const sections = ["home", "about", "work", "blog", "contact"];

    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const offsetTop = section.offsetTop - 100;
          if (window.scrollY >= offsetTop) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

      <nav className="navbar_links desktop-only">
        <ul>
          <li>
            <a href="#home" className={active === "home" ? "active" : ""}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" className={active === "about" ? "active" : ""}>
              About
            </a>
          </li>
          <li>
            <a href="#work" className={active === "work" ? "active" : ""}>
              Work
            </a>
          </li>

          <li>
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/shop");
              }}
            >
              Shop
            </a>
          </li>

          <li>
            <a href="#blog" className={active === "blog" ? "active" : ""}>
              Blog
            </a>
          </li>
          <li>
            <a href="#contact" className={active === "contact" ? "active" : ""}>
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <div className="navbar_actions">

        {!user ? (
          <button
            className="login-btn desktop-only"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <div className="desktop-only">
            {user.role !== "admin" && (
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart className="icon" />
                {cart.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
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
          </div>
        )}

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>

      <nav className={`navbar_links mobile-menu ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <a
              href="#home"
              className={active === "home" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={active === "about" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#work"
              className={active === "work" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Work
            </a>
          </li>

          <li>
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/shop");
              }}
            >
              Shop
            </a>
          </li>

          <li>
            <a
              href="#blog"
              className={active === "blog" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={active === "contact" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </li>

          {!user && (
            <li className="mobile-only">
              <button
                className="login-btn"
                onClick={() => handleNavigate("/login")}
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>

    </header>
  );
}

export default Navbar;