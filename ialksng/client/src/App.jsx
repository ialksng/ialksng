import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/my-purchases" element={<MyPurchases />} />
      <Route path="/content/:id" element={<ProductContent />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/access/:id" element={<ViewProduct />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route path="/blog" element={<Blog />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/admin/blog/create" element={<CreateBlog />} />
      <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/access/:id" element={<AccessProduct />} />
    </Routes>
  );
}

export default App;


