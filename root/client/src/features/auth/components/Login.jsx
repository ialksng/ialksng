import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      loginSuccess(res.data, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("/auth/google", { token: response.credential });
      loginSuccess(res.data, true);
      navigate(from, { replace: true });
    } catch {
      setError("Google login failed");
    }
  };

  if (user) return null;

  return (
    <div className="login__container">
      <div className="login__card">
        <h2>Welcome Back</h2>

        {error && <p className="login__error">{error}</p>}

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
            onError={() => setError("Google Error")}
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