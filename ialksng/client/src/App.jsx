import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Synchronous Imports (Components visible immediately or globally)
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Loader from "./components/Loader"; // Using your existing Loader component

// 🚀 Lazy Loaded Pages (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./features/auth/components/pages/Login"));
const Signup = lazy(() => import("./features/auth/components/pages/Signup"));
const ForgotPassword = lazy(() => import("./features/auth/components/ForgotPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyPurchases = lazy(() => import("./pages/MyPurchases"));
const ProductContent = lazy(() => import("./pages/ProductContent"));
const Cart = lazy(() => import("./pages/Cart"));
const ViewProduct = lazy(() => import("./pages/ViewProduct"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const Shop = lazy(() => import("./components/Shop"));
const Blog = lazy(() => import("./components/Blog"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const CreateBlog = lazy(() => import("./pages/admin/CreateBlog"));
const EditBlog = lazy(() => import("./pages/admin/EditBlog"));
const BlogDetail = lazy(() => import("./components/BlogDetail"));
const NotesViewer = lazy(() => import("./pages/NotesViewer")); 
const AdminAbout = lazy(() => import("./pages/admin/AdminAbout"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const AdminCertifications = lazy(() => import("./pages/admin/AdminCertifications"));

function App() {
  const location = useLocation();

  return (
    <>
      {/* ⏳ Wrap the routing in Suspense to show Loader while downloading chunks */}
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/checkout/:id" element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path="/my-purchases" element={<PageWrapper><MyPurchases /></PageWrapper>} />
            <Route path="/content/:id" element={<PageWrapper><ProductContent /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="/terms-and-conditions" element={<PageWrapper><TermsConditions /></PageWrapper>} />
            <Route path="/refund-policy" element={<PageWrapper><RefundPolicy /></PageWrapper>} />
            
            {/* Main Product Access Dashboard */}
            <Route path="/access/:id" element={<PageWrapper><ViewProduct /></PageWrapper>} />
            
            {/* Route for viewing detailed notes/Notion content */}
            <Route path="/notes/:id" element={<PageWrapper><NotesViewer /></PageWrapper>} />

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

            <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/admin/blog" element={<PageWrapper><AdminBlog /></PageWrapper>} />
            <Route path="/admin/blog/create" element={<PageWrapper><CreateBlog /></PageWrapper>} />
            <Route path="/admin/blog/edit/:id" element={<PageWrapper><EditBlog /></PageWrapper>} />
            <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
            
            <Route path="/admin/about" element={<PageWrapper><AdminAbout /></PageWrapper>} />
            <Route
              path="/admin/projects"
              element={
                <AdminRoute>
                  <PageWrapper><AdminProjects /></PageWrapper>
                </AdminRoute>
              }
            />
            <Route path="/admin/certifications" element={<AdminRoute><PageWrapper><AdminCertifications /></PageWrapper></AdminRoute>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      
      {/* ✅ Added Footer here so it is visible on all pages */}
      <Footer />
      <Chatbot />
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