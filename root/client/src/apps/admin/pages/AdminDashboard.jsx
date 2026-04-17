import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../core/components/Loader";
import "./admin.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
      </div>

      {loading && <Loader />}

      {stats && !loading && (
        <div className="admin-form" style={{ marginBottom: "24px" }}>
          <div className="flex gap-4 mb-2" style={{ flexWrap: "wrap" }}>
            <div className="form-section w-1/4" style={{ textAlign: "center", margin: 0 }}>
              👀 Visitors: <br />
              <strong>{stats.visitors}</strong>
            </div>
            <div className="form-section w-1/4" style={{ textAlign: "center", margin: 0 }}>
              📅 Today: <br />
              <strong>{stats.todayVisitors}</strong>
            </div>
            <div className="form-section w-1/4" style={{ textAlign: "center", margin: 0 }}>
              👤 Users: <br />
              <strong>{stats.users}</strong>
            </div>
            <div className="form-section w-1/4" style={{ textAlign: "center", margin: 0 }}>
              💰 Revenue: <br />
              <strong>₹{stats.revenue}</strong>
            </div>
          </div>

          <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: "Users", value: stats.users },
                  { name: "Orders", value: stats.orders },
                  { name: "Revenue", value: stats.revenue },
                  { name: "Visitors", value: stats.visitors }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="admin-grid">
        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/products")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>🛒 Shop Products</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Manage your store products</p>
        </div>

        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/blog")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>📝 Blog</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Create and manage blog posts</p>
        </div>

        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/newsletter")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>🔔 Newsletter</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Send emails to subscribers</p>
        </div>

        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/projects")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>🚀 Projects</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Manage portfolio projects</p>
        </div>

        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/about")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>👤 About Section</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Edit your profile & bio</p>
        </div>

        <div className="admin-card" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/home")}>
          <h3 style={{ color: "#38bdf8", marginBottom: "8px" }}>🏠 Home Section</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>Edit your Home page data</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;