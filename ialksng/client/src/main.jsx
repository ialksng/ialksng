import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>

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

          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);