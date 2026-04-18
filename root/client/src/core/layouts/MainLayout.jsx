import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'var(--bg-card)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger-color)',
              secondary: 'var(--bg-card)',
            },
          },
        }}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;