import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../features/auth/AuthContext";

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;