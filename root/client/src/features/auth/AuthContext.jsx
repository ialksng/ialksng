import React, { createContext, useState, useEffect } from "react";
import axios from "../../core/utils/axios";

import Loader from "../../core/components/Loader"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        setAuthToken(token);
        const res = await axios.get("/auth/me");

        if (!res?.data?.user) throw new Error("Invalid user");

        setUser(res.data.user);
      } catch (err) {
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginSuccess = (data, rememberMe = true) => {
    const { token, user } = data;

    if (!token || !user) return;

    if (rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token"); 
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token"); 
    }

    setAuthToken(token);
    setUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginSuccess, logoutUser }}>
      {loading ? (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};