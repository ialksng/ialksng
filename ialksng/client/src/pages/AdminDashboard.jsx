import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/admin.css";
import Loader from "../components/Loader";

// 📊 chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  // 🔥 fetch analytics
  useEffect(() => {
    fetch(`${API}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin__container">

      {/* 🔙 BACK */}
      <button
        className="admin__back"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      <h1 className="admin__title">Admin Dashboard</h1>

      {/* 🔄 LOADING */}
      {loading && <Loader />}

      {/* 🔥 ANALYTICS */}
      {stats && !loading && (
        <div className="admin__analytics">

          {/* 📊 CARDS */}
          <div className="admin__stats">
            <div className="admin__stat">👀 Visitors: {stats.visitors}</div>
            <div className="admin__stat">📅 Today: {stats.todayVisitors}</div>
            <div className="admin__stat">👤 Users: {stats.users}</div>
            <div className="admin__stat">🛒 Orders: {stats.orders}</div>
            <div className="admin__stat">💰 Revenue: ₹{stats.revenue}</div>
          </div>

          {/* 📈 RESPONSIVE CHART */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: "Users", value: stats.users },
                  { name: "Orders", value: stats.orders },
                  { name: "Revenue", value: stats.revenue },
                  { name: "Visitors", value: stats.visitors }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a344a" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#3399cc"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🏆 TOP PRODUCTS */}
          <div className="admin__top">
            <h3>🏆 Top Products</h3>

            {stats.topProducts?.length === 0 && <p>No sales yet</p>}

            {stats.topProducts?.map((p, i) => (
              <p key={i}>
                {p._id?.title || "Unknown"} — {p.count} sales
              </p>
            ))}
          </div>

        </div>
      )}

      {/* 🔥 ADMIN CARDS */}
      <div className="admin__grid">

        <div className="admin__card" onClick={() => navigate("/admin/products")}>
          <h2>🛒 Shop Products</h2>
          <p>Manage your store products</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/blog")}>
          <h2>📝 Blog</h2>
          <p>Create and manage blog posts</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/updates")}>
          <h2>🔔 Updates</h2>
          <p>Post announcements or updates</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/testimonials")}>
          <h2>⭐ Testimonials</h2>
          <p>Manage client feedback</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/services")}>
          <h2>🛠 Services</h2>
          <p>Manage your services</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/projects")}>
          <h2>🚀 Projects</h2>
          <p>Manage portfolio projects</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/socials")}>
          <h2>🌐 Social Media</h2>
          <p>Manage social media links</p>
        </div>

        <div className="admin__card" onClick={() => navigate("/admin/about")}>
          <h2>👤 About Section</h2>
          <p>Edit your profile & bio</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;