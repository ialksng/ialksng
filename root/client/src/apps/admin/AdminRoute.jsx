import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../features/auth/AuthContext";
import Loader from "../../core/components/Loader";

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;