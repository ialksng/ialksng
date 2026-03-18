import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import MyPurchases from "./pages/MyPurchases";
import ProductContent from "./pages/ProductContent";
import Cart from "./pages/Cart";
import ViewProduct from "./pages/ViewProduct";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";
import Blog from "./components/Blog";
import AdminBlog from "./pages/admin/AdminBlog";
import CreateBlog from "./pages/admin/CreateBlog";
import EditBlog from "./pages/admin/EditBlog";
import BlogDetail from "./components/BlogDetail";
import AccessProduct from "./pages/AccessProduct";

import Loader from "./components/Loader";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/checkout/:id" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/my-purchases" element={<PageWrapper><MyPurchases /></PageWrapper>} />
          <Route path="/content/:id" element={<PageWrapper><ProductContent /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="/access/:id" element={<PageWrapper><ViewProduct /></PageWrapper>} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <PageWrapper><AdminProducts /></PageWrapper>
              </AdminRoute>
            }
          />

          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/admin/blog" element={<PageWrapper><AdminBlog /></PageWrapper>} />
          <Route path="/admin/blog/create" element={<PageWrapper><CreateBlog /></PageWrapper>} />
          <Route path="/admin/blog/edit/:id" element={<PageWrapper><EditBlog /></PageWrapper>} />
          <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
          <Route path="/access/:id" element={<PageWrapper><AccessProduct /></PageWrapper>} />

        </Routes>
      </AnimatePresence>
    </>
  );
}

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default App;