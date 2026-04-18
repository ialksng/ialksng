import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { AuthContext } from "../AuthContext";
import axios from "../../../core/utils/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#0f172a,#020617)] p-5">
      <div className="w-full max-w-[380px] p-8 rounded-[18px] bg-white/5 border border-white/10 backdrop-blur-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
        <h2 className="text-[22px] font-semibold text-white mb-1.5">Welcome Back</h2>

        {error && <p className="text-red-500 text-[13px] mb-2.5">{error}</p>}

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 my-1.5 rounded-lg border border-slate-800 bg-[#020617] text-white text-sm transition-all focus:border-sky-400 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.2)] focus:outline-none box-border"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 my-1.5 rounded-lg border border-slate-800 bg-[#020617] text-white text-sm transition-all focus:border-sky-400 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.2)] focus:outline-none box-border"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex justify-between text-[13px] my-2.5 mb-5">
            <label className="flex items-center gap-1.5 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="cursor-pointer"
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="text-[#0095f6] no-underline">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="block w-full p-3 mt-3 rounded-lg border-none bg-gradient-to-br from-sky-400 to-sky-500 text-black font-semibold cursor-pointer transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(56,189,248,0.4)] box-border"
          >
            Login
          </button>
        </form>

        <div className="my-[18px] relative text-[12px] text-slate-500 flex justify-center items-center">
          <div className="absolute w-[42%] h-[1px] bg-slate-800 left-0"></div>
          <span className="bg-[#020617] px-2.5 z-10">OR</span>
          <div className="absolute w-[42%] h-[1px] bg-slate-800 right-0"></div>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Error")}
          />
        </div>

        <p className="mt-3.5 text-[13px] text-slate-400">
          Don't have an account? <Link to="/signup" className="text-sky-400 no-underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;