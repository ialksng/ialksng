import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../../features/cart/CartContext";
import { AuthContext } from "../../features/auth/AuthContext";
import Loader from "../../core/components/Loader";
import Pagination from "../../core/components/Pagination";

// Optional: You can remove Store.css if you are migrating fully to Tailwind utility classes.
// import "./Store.css";

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
  const itemsPerPage = 8; // Increased for a better grid view

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
      toast("Item is already in your cart ⚠️");
      return;
    }

    addToCart(product);
    setAddedId(product._id);
    toast.success("Added to cart 🛒");
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      navigate("/login", { state: { from: `/checkout/${product._id}` } });
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  const handleAccess = () => {
    // Redirect to the Gurukul platform
    window.location.href = "https://gurukul.ialksng.com";
  };

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
         <Loader />
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar: Title & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Resource Store</h2>
            <p className="text-sm text-gray-500 mt-1">Premium code, tools, and design templates.</p>
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search for products, codes, templates..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                <ul className="space-y-2">
                  {["all", "notes", "roadmap", "project", "code"].map(cat => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-2 py-1.5 rounded text-sm capitalize transition-colors ${
                          activeCategory === cat ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
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
                <h4 className="font-medium text-gray-700 mb-3">Sort By Price</h4>
                <select 
                  className="w-full border-gray-300 rounded text-sm p-2 outline-none focus:border-blue-500 border"
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
                  const isOwned = ownedProducts.includes(product._id);
                  const isFree = product.price === 0;
                  const hasAccess = isOwned || isFree;

                  return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col" key={product._id}>
                      {/* Image Area */}
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group" onClick={() => setPreviewProduct(product)}>
                        <img 
                          src={product.image || "/default-product.png"} 
                          alt={product.title || "product"} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Quick View</span>
                        </div>
                        {isFree && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">FREE</span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-grow">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category || "General"}</span>
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[3rem]" title={product.title}>{product.title || "Untitled"}</h3>
                        
                        {/* Rating Mockup */}
                        <div className="flex items-center text-yellow-400 text-xs mb-2">
                          ★★★★☆ <span className="text-blue-500 ml-1 hover:underline cursor-pointer">({Math.floor(Math.random() * 500) + 50})</span>
                        </div>

                        <div className="mt-auto pt-3">
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-xl font-bold text-gray-900">₹{product.price || 0}</span>
                            {product.price > 0 && (
                              <span className="text-sm text-gray-400 line-through">₹{Math.floor(product.price * 1.4)}</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {hasAccess ? (
                              <button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                                onClick={handleAccess}
                              >
                                Access Now
                              </button>
                            ) : (
                              <>
                                <button
                                  className={`w-full py-2 rounded-full font-medium transition-colors text-sm ${addedId === product._id ? "bg-gray-200 text-gray-800" : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm"}`}
                                  onClick={() => handleAddToCart(product)}
                                  disabled={addedId === product._id}
                                >
                                  {addedId === product._id ? "Added to Cart ✓" : "Add to Cart"}
                                </button>
                                <button
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full font-medium transition-colors text-sm shadow-sm"
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
              <div className="bg-white p-12 text-center rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button 
                  className="mt-4 text-blue-600 hover:underline"
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setPreviewProduct(null)}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                <img 
                  src={previewProduct.previewImage || previewProduct.image || "/default-product.png"} 
                  alt={previewProduct.title} 
                  className="max-h-80 object-contain"
                />
              </div>
              <div className="md:w-1/2 p-6 flex flex-col relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setPreviewProduct(null)}>✕</button>
                <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase mb-1">{previewProduct.category}</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{previewProduct.title}</h3>
                <p className="text-gray-600 mb-6 text-sm flex-grow">{previewProduct.description}</p>
                
                <div className="mt-auto border-t pt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">₹{previewProduct.price}</span>
                  {previewProduct.previewUrl && (
                    <a 
                      href={previewProduct.previewUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline flex items-center gap-1"
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