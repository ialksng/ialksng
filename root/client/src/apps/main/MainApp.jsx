import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AdminRoute from "../admin/AdminRoute.jsx";
import Chatbot from "../ai/Chatbot.jsx";
import Loader from "../../core/components/Loader.jsx";
import MainLayout from "../../core/layouts/MainLayout.jsx";
import CookieConsent from "../../core/components/CookieConsent.jsx"

const Home = lazy(() => import("./pages/public/home/Home"));
const About = lazy(() => import("./pages/public/about/About"));
const Work = lazy(() => import("./pages/public/work/Work"));
const Blog = lazy(() => import("../blog/Blog.jsx")); 
const Store = lazy(() => import("../store/Store.jsx"));
const Contact = lazy(() => import("./pages/public/contact/Contact.jsx"));
const More = lazy(() => import("../more/More.jsx"));
const Search = lazy(() => import("./pages/public/search/Search.jsx"));

const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsConditions = lazy(() => import("./pages/legal/TermsConditions"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const CookiesPolicy = lazy(() => import("./pages/legal/CookiesPolicy"));

const Login = lazy(() => import("../../features/auth/components/Login.jsx"));
const Signup = lazy(() => import("../../features/auth/components/Signup"));
const ForgotPassword = lazy(() => import("../../features/auth/components/ForgotPassword"));
const Checkout = lazy(() => import("../../features/checkout/Checkout.jsx"));
const MyPurchases = lazy(() => import("../../features/products/MyPurchases.jsx"));
const ProductContent = lazy(() => import("../../apps/lms/ProductContent.jsx"));
const Cart = lazy(() => import("../../features/cart/Cart.jsx"));
const ViewProduct = lazy(() => import("../../apps/lms/ViewProduct.jsx"));

const BlogDetail = lazy(() => import("../blog/BlogDetail.jsx"));
const CreateBlog = lazy(() => import("../blog/CreateBlog.jsx"));
const EditBlog = lazy(() => import("../blog/EditBlog.jsx"));
const NotesViewer = lazy(() => import("../lms/NotesViewer.jsx"));

const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("../admin/pages/AdminProducts"));
const AdminBlog = lazy(() => import("../admin/pages/AdminBlog"));
const AdminAbout = lazy(() => import("../admin/pages/AdminAbout"));
const AdminProjects = lazy(() => import("../admin/pages/AdminProjects"));
const AdminCertifications = lazy(() => import("../admin/pages/AdminCertifications"));

function MainApp() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route element={<MainLayout />}>

              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/work" element={<PageWrapper><Work /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/more" element={<PageWrapper><More /></PageWrapper>} />
              <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />

              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
              <Route path="/cookie-policy" element={<PageWrapper><CookiesPolicy /></PageWrapper>} />

              <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />

              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/checkout/:id" element={<PageWrapper><Checkout /></PageWrapper>} />
              <Route path="/my-purchases" element={<PageWrapper><MyPurchases /></PageWrapper>} />
              <Route path="/content/:id" element={<PageWrapper><ProductContent /></PageWrapper>} />
              <Route path="/access/:id" element={<PageWrapper><ViewProduct /></PageWrapper>} />
              <Route path="/notes/:id" element={<PageWrapper><NotesViewer /></PageWrapper>} />

              <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
              <Route path="/terms-and-conditions" element={<PageWrapper><TermsConditions /></PageWrapper>} />
              <Route path="/refund-policy" element={<PageWrapper><RefundPolicy /></PageWrapper>} />

              <Route element={<AdminRoute><Outlet /></AdminRoute>}>
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="/admin/products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
                <Route path="/admin/blog" element={<PageWrapper><AdminBlog /></PageWrapper>} />
                <Route path="/admin/blog/create" element={<PageWrapper><CreateBlog /></PageWrapper>} />
                <Route path="/admin/blog/edit/:id" element={<PageWrapper><EditBlog /></PageWrapper>} />
                <Route path="/admin/about" element={<PageWrapper><AdminAbout /></PageWrapper>} />
                <Route path="/admin/projects" element={<PageWrapper><AdminProjects /></PageWrapper>} />
                <Route path="/admin/certifications" element={<PageWrapper><AdminCertifications /></PageWrapper>} />
              </Route>

            </Route>

          </Routes>
        </AnimatePresence>
      </Suspense>

      <Chatbot />
      <CookieConsent />
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

export default MainApp;