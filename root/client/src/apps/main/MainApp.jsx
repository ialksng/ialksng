import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import MainLayout from "../../core/layouts/MainLayout.jsx";
import AdminLayout from "../../apps/admin/Layouts/AdminLayout.jsx";
import Loader from "../../core/components/Loader.jsx";
import CookieConsent from "../../core/components/CookieConsent.jsx";
import Chatbot from "../ai/Chatbot.jsx";
import AdminRoute from "../admin/AdminRoute.jsx";
const Profile = lazy(() => import("../../features/profile/Profile.jsx"));

const Home = lazy(() => import("./pages/public/home/Home.jsx"));
const About = lazy(() => import("./pages/public/about/About.jsx"));
const Work = lazy(() => import("./pages/public/work/Work.jsx"));
const Contact = lazy(() => import("./pages/public/contact/Contact.jsx"));
const Search = lazy(() => import("./pages/public/search/Search.jsx"));

const Blog = lazy(() => import("../blog/Blog.jsx"));
const BlogDetail = lazy(() => import("../blog/BlogDetail.jsx"));
const CreateBlog = lazy(() => import("../blog/CreateBlog.jsx"));
const EditBlog = lazy(() => import("../blog/EditBlog.jsx"));

const Store = lazy(() => import("../store/Store.jsx"));
const Cart = lazy(() => import("../../features/cart/Cart.jsx"));
const Checkout = lazy(() => import("../../features/checkout/Checkout.jsx"));
const MyPurchases = lazy(() => import("../../features/products/MyPurchases.jsx"));
const ViewProduct = lazy(() => import("../../apps/lms/ViewProduct.jsx"));
const ProductContent = lazy(() => import("../../apps/lms/ProductContent.jsx"));
const NotesViewer = lazy(() => import("../lms/NotesViewer.jsx"));

const Login = lazy(() => import("../../features/auth/components/Login.jsx"));
const Signup = lazy(() => import("../../features/auth/components/Signup.jsx"));
const ForgotPassword = lazy(() => import("../../features/auth/components/ForgotPassword.jsx"));

const More = lazy(() => import("../more/More.jsx"));

const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsConditions = lazy(() => import("./pages/legal/TermsConditions.jsx"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy.jsx"));
const CookiesPolicy = lazy(() => import("./pages/legal/CookiesPolicy.jsx"));

const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard.jsx"));
const AdminHome = lazy(() => import("../admin/pages/AdminHome.jsx"));
const AdminAbout = lazy(() => import("../admin/pages/AdminAbout.jsx"));
const AdminProjects = lazy(() => import("../admin/pages/AdminProjects.jsx"));
const AdminBlog = lazy(() => import("../admin/pages/AdminBlog.jsx"));
const AdminProducts = lazy(() => import("../admin/pages/AdminProducts.jsx"));
const AdminCertifications = lazy(() => import("../admin/pages/AdminCertifications.jsx"));
const AdminNewsletter = lazy(() => import("../admin/pages/AdminNewsletter.jsx"));


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
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/more" element={<PageWrapper><More /></PageWrapper>} />
              <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />

              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />

              <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/checkout/:id" element={<PageWrapper><Checkout /></PageWrapper>} />
              <Route path="/my-purchases" element={<PageWrapper><MyPurchases /></PageWrapper>} />
              <Route path="/content/:id" element={<PageWrapper><ProductContent /></PageWrapper>} />
              <Route path="/access/:id" element={<PageWrapper><ViewProduct /></PageWrapper>} />
              <Route path="/notes/:id" element={<PageWrapper><NotesViewer /></PageWrapper>} />

              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />

              <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
              
              <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
              <Route path="/terms-and-conditions" element={<PageWrapper><TermsConditions /></PageWrapper>} />
              <Route path="/refund-policy" element={<PageWrapper><RefundPolicy /></PageWrapper>} />
              <Route path="/cookie-policy" element={<PageWrapper><CookiesPolicy /></PageWrapper>} />

              <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="/admin/home" element={<PageWrapper><AdminHome /></PageWrapper>} />
                <Route path="/admin/products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
                <Route path="/admin/blog" element={<PageWrapper><AdminBlog /></PageWrapper>} />
                <Route path="/admin/blog/create" element={<PageWrapper><CreateBlog /></PageWrapper>} />
                <Route path="/admin/blog/edit/:id" element={<PageWrapper><EditBlog /></PageWrapper>} />
                <Route path="/admin/about" element={<PageWrapper><AdminAbout /></PageWrapper>} />
                <Route path="/admin/projects" element={<PageWrapper><AdminProjects /></PageWrapper>} />
                <Route path="/admin/certifications" element={<PageWrapper><AdminCertifications /></PageWrapper>} />
                <Route path="/admin/newsletter" element={<PageWrapper><AdminNewsletter /></PageWrapper>} />
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