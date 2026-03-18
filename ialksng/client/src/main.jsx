import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>

          {/* 🔥 TOASTER (IMPORTANT) */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111a2b",
                color: "#fff",
                border: "1px solid #2a344a"
              }
            }}
          />

          <App />

        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);