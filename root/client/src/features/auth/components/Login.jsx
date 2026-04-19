import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { AuthContext } from "../AuthContext";
import axios from "../../../core/utils/axios";
import "./Login.css";

const Login = () => {
  const { user, loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Logging in...');
    
    try {
      const res = await axios.post("/auth/login", form);
      loginSuccess(res.data, rememberMe);
      toast.success('Welcome back!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed", { id: toastId });
    }
  };

  const handleGoogleSuccess = async (response) => {
    const toastId = toast.loading('Authenticating...');
    
    try {
      const res = await axios.post("/auth/google", { token: response.credential });
      loginSuccess(res.data, true);
      toast.success('Login successful!', { id: toastId });
    } catch (err) {
      toast.error('Google login failed', { id: toastId });
    }
  };

  if (user) return null;

  return (
    <div className="login__container">
      <div className="login__card">
        <h2>Welcome Back</h2>

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="login__actions">
            <label className="login__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="login__forgot">
              Forgot password?
            </Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="login__divider">
          <span>OR</span>
        </div>

        <div className="login__oauth">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Error")}
          />
        </div>

        <p className="login__link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;