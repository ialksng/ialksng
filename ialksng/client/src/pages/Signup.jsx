import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: ""
  });

  const { loginUser } = useContext(AuthContext); // Removed setUser as loginUser handles it
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 NORMAL SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Signup
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Signup failed");
        return;
      }

      // Auto login
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        loginUser(loginData); // Successfully updates context and headers
        navigate("/");
      } else {
        alert("Login after signup failed");
      }

    } catch (err) {
      console.log("Signup error:", err);
    }
  };

  // 🔥 GOOGLE SIGNUP
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ FIX: Use loginUser instead of manual localStorage/setUser calls.
        // loginUser(data) ensures the token is saved AND axios headers are set.
        loginUser(data); 
        navigate("/");
      } else {
        alert("Google signup failed");
      }

    } catch (err) {
      console.log("Google signup error:", err);
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        <h2>Signup</h2>

        {/* 🔐 NORMAL SIGNUP */}
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Signup</button>
        </form>

        {/* 🔥 OR DIVIDER */}
        <div className="auth__divider">
          <span>OR</span>
        </div>

        {/* 🔥 GOOGLE SIGNUP */}
        <div className="google-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Signup Failed")}
          />
        </div>

        <p className="auth__link">
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;