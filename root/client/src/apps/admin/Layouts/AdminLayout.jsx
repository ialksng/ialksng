import { Outlet } from "react-router-dom"

import AdminSidebar from "./AdminSidebar"

import "./AdminLayout.css"

function AdminLayout() {
  return (
    <div className="admin">

      <AdminSidebar />

      <div className="admin__main">
        <Outlet />
      </div>

    </div>
  )
}

export default AdminLayout