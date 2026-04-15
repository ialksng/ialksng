import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../../../shared/utils/axios";
import "../../../shared/styles/auth.css"; 

const Login = () => {
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      loginSuccess(res.data); 
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("/auth/google", { token: response.credential });
      loginSuccess(res.data);
      navigate(from);
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        <h2>Welcome Back</h2>
        {error && <p className="auth__error" style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleEmailSubmit}>
          <input type="email" placeholder="Email" required 
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required 
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '10px 0 20px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ color: '#0095f6', textDecoration: 'none' }}>Forgot password?</Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth__divider"><span>OR</span></div>

        <div className="auth__oauth">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Error")} />
        </div>

        <p className="auth__link">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;