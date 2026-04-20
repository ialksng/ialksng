import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "../features/auth/AuthContext";
import { CartProvider } from "../features/cart/CartContext";


function AppProviders({ children }) {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>

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

            {children}

          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default AppProviders;