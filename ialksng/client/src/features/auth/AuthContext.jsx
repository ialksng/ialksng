import React, { createContext, useState, useEffect } from "react";
import axios from "../../utils/axios";

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
        const token = localStorage.getItem("token");
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

  const loginSuccess = (data) => {
    const { token, user } = data;

    if (!token || !user) return;

    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginSuccess, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};