import axios from "axios";

const instance = axios.create({
  baseURL: "https://ialksng-backend.onrender.com/api",
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  console.log("SENDING TOKEN:", user?.token); // 🔥 DEBUG

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default instance;