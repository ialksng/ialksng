import { createContext, useState, useEffect } from "react";
import axios from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Set/remove token globally for all axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // 🔥 AUTO LOGIN (SAFE + STABLE)
  // Restores session from localStorage and verifies the token with the backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        setAuthToken(token);

        // Verify token with backend to get fresh user data
        const res = await axios.get("/api/auth/me"); // Ensure this route exists in authRoutes.js

        if (!res?.data?.user) {
          throw new Error("Invalid user data");
        }

        const userData = {
          ...res.data.user,
          token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.warn("Auth restore failed:", err.message);

        // 🔴 Clean everything if verification fails
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔥 LOGIN (EMAIL + GOOGLE SAFE)
  // Handles data from authController.js login or Google OAuth success
  const loginUser = (data) => {
    // Check if data contains the expected structure from your controller
    const token = data.token;
    const userBase = data.user;

    if (!userBase || !token) {
      console.error("Invalid login data received", data);
      return;
    }

    const userData = {
      ...userBase,
      token: token,
    };

    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
  };

  // 🔥 LOGOUT (SAFE CLEAN)
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  // 🔥 UPDATE USER (SAFE)
  const updateUser = (newData) => {
    if (!user) return;

    const updatedUser = { ...user, ...newData };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,      // kept for manual Google login overrides if needed
        loginUser,
        logoutUser,
        updateUser,
        loading,
      }}
    >
      {!loading ? children : <div className="loading">Loading...</div>}
    </AuthContext.Provider>
  );
};