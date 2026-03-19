import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginUser, setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 Normal Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        loginUser(data);
        navigate(from);
      } else {
        alert(data.msg || "Login failed");
      }

    } catch (err) {
      console.log("Login error:", err);
    }
  };

  // 🔥 GOOGLE LOGIN
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
        // save token
        localStorage.setItem("token", data.token);

        // update context
        setUser(data.user);

        // redirect
        navigate(from);
      } else {
        alert("Google login failed");
      }

    } catch (err) {
      console.log("Google login error:", err);
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        <h2>Login</h2>

        {/* 🔐 EMAIL LOGIN */}
        <form onSubmit={handleSubmit}>
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

          <button type="submit">Login</button>
        </form>

        {/* 🔥 OR DIVIDER */}
        <div className="auth__divider">
          <span>OR</span>
        </div>

        {/* 🔥 GOOGLE BUTTON */}
        <div className="google-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        <p className="auth__link">
          Don't have an account?{" "}
          <Link to="/signup">
            <span>Signup</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;