import React, { createContext, useState, useEffect } from "react";
import axios from "../../shared/utils/axios"; 

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
        if (!token) return setLoading(false);

        setAuthToken(token);
        const res = await axios.get("/auth/me"); 
        if (!res?.data?.user) throw new Error("Invalid user data");

        setUser({ ...res.data.user, token });
      } catch (err) {
        logoutUser(); 
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginSuccess = (data) => {
    const { token, user: userBase } = data;
    if (!userBase || !token) return;

    setAuthToken(token);
    localStorage.setItem("token", token);
    setUser({ ...userBase, token });
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