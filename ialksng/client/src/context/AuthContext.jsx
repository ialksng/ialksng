import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 Auto login (FIXED)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser({ ...JSON.parse(storedUser), token });
    }
  }, []);

  // 🔹 Login (FIXED)
  const loginUser = (data) => {
    const userData = {
      ...data.user,
      token: data.token,
    };

    // ✅ store BOTH
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    setUser(userData);
  };

  // 🔹 Logout (FIXED)
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ important
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};