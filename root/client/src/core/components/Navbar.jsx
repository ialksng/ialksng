import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import axios from "../utils/axios";

import { AuthContext } from "../../features/auth/AuthContext";
import { CartContext } from "../../features/cart/CartContext";
import NotificationBell from "../components/NotificationBell";
import logo from "../../core/assets/logo.png";

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
  const mobileSearchRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setShowSuggestions(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("hide-bot");
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("hide-bot");
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("hide-bot");
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 968 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

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
    <header 
      className={`fixed top-0 w-full z-[1000] flex justify-between items-center px-5 lg:px-10 h-[80px] transition-colors duration-300 box-border ${
        menuOpen ? "bg-[#0f172a]" : "bg-[#0f172a]/85 backdrop-blur-[12px] border-b border-white/5"
      }`} 
      ref={menuRef}
    >
      <img
        src={logo}
        alt="Alok Singh Logo"
        className="h-[40px] cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={() => navigate("/")}
      />

      <nav className="hidden lg:block">
        <ul className="flex gap-[30px] list-none m-0 p-0">
          {["Home", "About", "Work", "Blog", "Store", "Contact", "More"].map((item) => (
            <li key={item}>
              <NavLink 
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                className={({isActive}) => `text-[15px] font-medium no-underline transition-colors duration-200 ${isActive ? 'text-sky-400' : 'text-slate-300 hover:text-sky-400'}`}
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-5">
        <div className="hidden lg:block relative" ref={searchRef}>
          <form 
            className="flex items-center bg-black/20 border border-white/10 rounded-[20px] py-2 px-4 w-[250px] transition-colors duration-200 box-border focus-within:border-sky-400" 
            onSubmit={handleSearchSubmit}
          >
            <FaSearch className="text-slate-400 mr-[10px] text-[14px]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-white outline-none w-full text-[14px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </form>

          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute top-[50px] left-0 w-full bg-[#0f172a] border border-white/10 rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[1001]">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 px-4 flex justify-between items-center cursor-pointer transition-colors duration-200 border-b border-white/5 hover:bg-white/5"
                    onClick={() => handleSuggestionClick(item.url)}
                  >
                    <span className="text-white text-[14px]">{item.title}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-[4px] uppercase font-bold ${
                      item.type === 'product' ? 'bg-sky-400/10 text-sky-400' :
                      item.type === 'blog' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-[14px]">No results found</div>
              )}
            </div>
          )}
        </div>

        <NotificationBell />

        {user && user.role !== "admin" && (
          <div className="relative flex items-center text-slate-300 text-[20px] cursor-pointer transition-colors duration-200 hover:text-sky-400" onClick={() => handleNavigate("/cart")}>
            <FaShoppingCart />
            {cart?.length > 0 && <span className="absolute -top-[8px] -right-[10px] bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>}
          </div>
        )}

        {!user ? (
          <button className="hidden lg:block bg-gradient-to-br from-sky-400 to-sky-500 text-[#0f172a] border-none py-2.5 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(56,189,248,0.3)]" onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <div className="hidden lg:flex items-center gap-[15px]">
            <div className="relative" ref={dropdownRef}>
              <div className="text-slate-300 text-[20px] cursor-pointer transition-colors duration-200 hover:text-sky-400" onClick={() => setOpen(!open)}>
                <FaUser />
              </div>

              {open && (
                <div className="absolute top-[40px] right-0 bg-[#0f172a] border border-white/10 rounded-[12px] w-[220px] py-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
                  {user.role !== "admin" && (
                    <div className="py-3 px-5 text-slate-300 text-[14px] font-medium cursor-pointer transition-colors duration-200 hover:bg-white/5 hover:text-white" onClick={() => handleNavigate("/profile")}>
                      Profile
                    </div>
                  )}

                  {user.role === "admin" && (
                    <div className="py-3 px-5 text-slate-300 text-[14px] font-medium cursor-pointer transition-colors duration-200 hover:bg-white/5 hover:text-white" onClick={() => handleNavigate("/admin")}>
                      Admin Panel
                    </div>
                  )}

                  <div
                    className="py-3 px-5 text-red-500 text-[14px] font-medium cursor-pointer transition-colors duration-200 border-t border-white/5 mt-[5px] hover:bg-red-500/10"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
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

        <div className="lg:hidden block text-[24px] text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      <nav className={`lg:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[#0f172a] z-[999] flex flex-col py-[30px] px-[20px] box-border transition-all duration-300 ease-in-out ${menuOpen ? "translate-x-0 visible opacity-100" : "translate-x-full invisible opacity-0"}`}>
        <div className="relative mb-[30px] w-full" ref={mobileSearchRef}>
          <form className="flex items-center bg-black/20 border border-white/10 rounded-[20px] py-2 px-4 w-full focus-within:border-sky-400" onSubmit={handleSearchSubmit}>
            <FaSearch className="text-slate-400 mr-[10px] text-[14px]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-white outline-none w-full text-[14px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </form>

          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute top-[45px] left-0 w-full bg-[#0f172a] border border-white/10 rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[1001]">
            </div>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto flex flex-col gap-[15px] pb-[20px] list-none m-0 p-0">
          {["Home", "About", "Work", "Blog", "Store", "Contact", "More"].map((item) => (
             <li key={item} className="w-full" onClick={() => setMenuOpen(false)}>
               <NavLink to={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="block text-[18px] text-slate-300 py-3 no-underline border-b border-white/5 hover:text-sky-400">
                 {item}
               </NavLink>
             </li>
          ))}

          {!user ? (
            <li className="w-full mt-2">
              <button className="w-full text-center bg-gradient-to-br from-sky-400 to-sky-500 text-[#0f172a] border-none py-2.5 px-6 rounded-lg font-semibold cursor-pointer" onClick={() => handleNavigate("/login")}>Login</button>
            </li>
          ) : (
            <>
              {user.role !== "admin" && (
                <li onClick={() => handleNavigate("/profile")} className="block text-[18px] text-slate-300 py-3 border-b border-white/5 cursor-pointer hover:text-sky-400">👤 Profile</li>
              )}

              {user.role === "admin" && (
                <li onClick={() => handleNavigate("/admin")} className="block text-[18px] text-amber-500 py-3 border-b border-white/5 cursor-pointer hover:text-sky-400">👑 Admin Panel</li>
              )}

              <li
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logoutUser();
                    setMenuOpen(false);
                  }
                }}
                className="block text-[18px] text-red-500 py-3 cursor-pointer hover:text-red-400"
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;