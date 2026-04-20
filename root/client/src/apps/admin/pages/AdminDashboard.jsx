import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../core/components/Loader";
import axios from "../../../core/utils/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        
        const statsRes = await axios.get("/admin/stats", { headers });
        setStats(statsRes.data);

        const feedRes = await axios.get("/admin/feedbacks", { headers });
        setFeedbacks(feedRes.data);

      } catch (err) {
        console.error("Dashboard Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
     return (
       <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Loader />
       </div>
     );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Command Center</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>Welcome back to your dashboard.</p>
      </div>

      <div className="admin-grid" style={{ marginTop: 0, marginBottom: "30px" }}>
        <div className="admin-card" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.1), transparent)", borderLeft: "4px solid #38bdf8" }}>
          <h4 style={{ color: "var(--text-muted)", fontSize: "13px", textTransform: "uppercase", margin: 0 }}>Total Revenue</h4>
          <h2 style={{ fontSize: "32px", color: "#fff", margin: "10px 0 0 0" }}>₹{stats?.revenue || 0}</h2>
        </div>
        <div className="admin-card" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), transparent)", borderLeft: "4px solid #10b981" }}>
          <h4 style={{ color: "var(--text-muted)", fontSize: "13px", textTransform: "uppercase", margin: 0 }}>Total Users</h4>
          <h2 style={{ fontSize: "32px", color: "#fff", margin: "10px 0 0 0" }}>{stats?.users || 0}</h2>
        </div>
        <div className="admin-card" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), transparent)", borderLeft: "4px solid #f59e0b" }}>
          <h4 style={{ color: "var(--text-muted)", fontSize: "13px", textTransform: "uppercase", margin: 0 }}>Today's Visitors</h4>
          <h2 style={{ fontSize: "32px", color: "#fff", margin: "10px 0 0 0" }}>{stats?.todayVisitors || 0}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "30px" }}>
        
        <div className="admin-form" style={{ padding: "24px", margin: 0 }}>
          <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px" }}>Platform Overview</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: "Users", value: stats?.users || 0 },
                { name: "Orders", value: stats?.orders || 0 },
                { name: "Visits", value: stats?.visitors || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-form" style={{ padding: "24px", margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "10px" }}>Quick Actions</h3>
          <button className="btn secondary" style={{ justifyContent: "flex-start", padding: "14px" }} onClick={() => navigate("/admin/products")}>🛒 Manage Products</button>
          <button className="btn secondary" style={{ justifyContent: "flex-start", padding: "14px" }} onClick={() => navigate("/admin/blog")}>📝 Manage Blog</button>
          <button className="btn secondary" style={{ justifyContent: "flex-start", padding: "14px" }} onClick={() => navigate("/admin/home")}>🏠 Edit Home Page</button>
          <button className="btn secondary" style={{ justifyContent: "flex-start", padding: "14px" }} onClick={() => navigate("/admin/about")}>👤 Edit About Page</button>
        </div>

      </div>

      <div className="admin-form" style={{ maxWidth: "100%", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>User Feedback & Bug Reports</h3>
          <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>{feedbacks.length} Total</span>
        </div>
        
        <div className="admin-table-container" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User Email</th>
                <th>Subject</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>No feedback submitted yet.</td></tr>
              ) : (
                feedbacks.map(f => (
                  <tr key={f._id}>
                    <td style={{ whiteSpace: "nowrap" }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                    <td style={{ color: "var(--accent-primary)" }}>{f.email}</td>
                    <td style={{ fontWeight: "bold", color: "#fff" }}>{f.subject}</td>
                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;