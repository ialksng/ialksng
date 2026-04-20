import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../../features/cart/CartContext";
import { AuthContext } from "../../features/auth/AuthContext";
import Loader from "../../core/components/Loader";
import Pagination from "../../core/components/Pagination";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
        setProducts(list);
        setFiltered(list);
      } catch (err) {
        console.log("Product fetch error:", err);
        setProducts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        const ids = Array.isArray(data.orders) ? data.orders.map(o => o.product?._id).filter(Boolean) : [];
        setOwnedProducts(ids);
      } catch (err) {
        console.log("Orders fetch error:", err);
      }
    };
    fetchOrders();
  }, [user, API]);

  useEffect(() => {
    let temp = Array.isArray(products) ? [...products] : [];

    // Filter by Category
    if (activeCategory !== "all") {
      temp = temp.filter(p => (p.category || "").toLowerCase() === activeCategory);
    }

    // Filter by Search
    if (search.trim() !== "") {
      temp = temp.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()));
    }

    // Sort items
    if (sortOrder === "low-high") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "high-low") {
      temp.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFiltered(temp);
    setCurrentPage(1); 
  }, [search, activeCategory, sortOrder, products]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/store" } });
      return;
    }

    const alreadyInCart = cart.some(item => item._id === product._id);
    if (alreadyInCart) {
      toast("Item is already in your cart ⚠️", { style: { background: '#334155', color: '#fff' }});
      return;
    }

    addToCart(product);
    setAddedId(product._id);
    toast.success("Added to cart 🛒", { style: { background: '#334155', color: '#fff' }});
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      navigate("/login", { state: { from: `/checkout/${product._id}` } });
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  // BRIDGE APPROACH: Redirect to local access page instead of external URL
  const handleAccess = (product) => {
    navigate(`/access/${product._id}`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-900 flex items-center justify-center">
         <Loader />
      </div>
    );
  }

  return (
    <section className="bg-slate-900 min-h-screen py-8 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar: Title & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Resource Store</h2>
            <p className="text-sm text-slate-400 mt-1">Premium code, tools, and design templates.</p>
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search for products, codes, templates..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-700 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-300 mb-3 text-sm uppercase tracking-wider">Categories</h4>
                <ul className="space-y-2">
                  {["all", "notes", "roadmap", "project", "code"].map(cat => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                          activeCategory === cat ? "bg-sky-500/10 text-sky-400 font-medium border border-sky-500/20" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                        }`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-300 mb-3 text-sm uppercase tracking-wider">Sort By Price</h4>
                <select 
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm p-2.5 text-white outline-none focus:ring-2 focus:ring-sky-500 border appearance-none"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {Array.isArray(displayedProducts) && displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map(product => {
                  
                  // ADMIN BYPASS LOGIC
                  const isAdmin = user && user.role === "admin";
                  const isOwned = ownedProducts.includes(product._id);
                  const isFree = product.price === 0;
                  const hasAccess = isAdmin || isOwned || isFree;

                  return (
                    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden hover:border-slate-500 transition-colors duration-300 flex flex-col group" key={product._id}>
                      {/* Image Area */}
                      <div className="relative h-44 bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setPreviewProduct(product)}>
                        <img 
                          src={product.image || "/default-product.png"} 
                          alt={product.title || "product"} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-white/10 text-white border border-white/20 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">Quick View</span>
                        </div>
                        {isFree && (
                          <span className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-400">FREE</span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-xs text-sky-400 uppercase tracking-wider font-semibold mb-1">{product.category || "General"}</span>
                        <h3 className="text-base font-bold text-white line-clamp-2 mb-2 min-h-[3rem]" title={product.title}>{product.title || "Untitled"}</h3>
                        
                        {/* Rating Mockup */}
                        <div className="flex items-center text-yellow-400 text-xs mb-3">
                          ★★★★☆ <span className="text-slate-400 ml-1 hover:text-sky-400 transition-colors cursor-pointer">({Math.floor(Math.random() * 500) + 50})</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-700/50">
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-bold text-white">₹{product.price || 0}</span>
                            {product.price > 0 && (
                              <span className="text-sm text-slate-500 line-through">₹{Math.floor(product.price * 1.4)}</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {hasAccess ? (
                              <button 
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                                onClick={() => handleAccess(product)}
                              >
                                Access Now
                              </button>
                            ) : (
                              <>
                                <button
                                  className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm border ${addedId === product._id ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-transparent border-sky-500 text-sky-400 hover:bg-sky-500/10"}`}
                                  onClick={() => handleAddToCart(product)}
                                  disabled={addedId === product._id}
                                >
                                  {addedId === product._id ? "Added to Cart ✓" : "Add to Cart"}
                                </button>
                                <button
                                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
                                  onClick={() => handleBuyNow(product)}
                                >
                                  Buy Now
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-800 p-12 text-center rounded-xl border border-slate-700 shadow-sm">
                <p className="text-slate-400 text-lg">No products found matching your criteria.</p>
                <button 
                  className="mt-4 text-sky-400 hover:text-sky-300 font-medium"
                  onClick={() => { setSearch(""); setActiveCategory("all"); }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
          </main>
        </div>

        {/* Quick View Modal */}
        {previewProduct && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setPreviewProduct(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="md:w-1/2 bg-slate-900 flex items-center justify-center p-6 relative">
                <img 
                  src={previewProduct.previewImage || previewProduct.image || "/default-product.png"} 
                  alt={previewProduct.title} 
                  className="max-h-80 object-contain drop-shadow-xl"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col relative">
                <button className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center transition-colors" onClick={() => setPreviewProduct(null)}>✕</button>
                <span className="text-xs font-bold text-sky-400 tracking-wider uppercase mb-2 bg-sky-400/10 px-3 py-1 rounded-full w-fit">{previewProduct.category}</span>
                <h3 className="text-2xl font-bold text-white mb-3">{previewProduct.title}</h3>
                <p className="text-slate-400 mb-8 text-sm flex-grow leading-relaxed">{previewProduct.description || "No detailed description available."}</p>
                
                <div className="mt-auto border-t border-slate-700 pt-5 flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">₹{previewProduct.price}</span>
                  {previewProduct.previewUrl && (
                    <a 
                      href={previewProduct.previewUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sky-400 font-medium hover:text-sky-300 flex items-center gap-1.5 bg-sky-400/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      Live Preview
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default Shop;