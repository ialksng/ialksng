import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { AuthContext } from "../AuthContext";
import axios from "../../../core/utils/axios";

const Signup = () => {
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/auth/signup", form);
      const res = await axios.post("/auth/login", { email: form.email, password: form.password });
      loginSuccess(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("/auth/google", { token: response.credential });
      loginSuccess(res.data);
      navigate("/");
    } catch (err) {
      setError("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#0f172a,#020617)] p-5">
      <div className="w-full max-w-[380px] p-8 rounded-[18px] bg-white/5 border border-white/10 backdrop-blur-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
        <h2 className="text-[22px] font-semibold text-white mb-1.5">Create an Account</h2>
        <p className="text-[13px] text-slate-400 mb-[22px]">Sign up to see projects, buy notes, and access the AI.</p>
        
        {error && <p className="text-red-500 text-[13px] mb-2.5">{error}</p>}

        <div className="flex flex-col items-center gap-2.5">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Error")} />
        </div>

        <div className="my-[18px] relative text-[12px] text-slate-500 flex justify-center items-center">
          <div className="absolute w-[42%] h-[1px] bg-slate-800 left-0"></div>
          <span className="bg-[#020617] px-2.5 z-10">OR</span>
          <div className="absolute w-[42%] h-[1px] bg-slate-800 right-0"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {["username", "name", "email", "password"].map((field, idx) => (
            <input 
              key={idx}
              type={field === "email" ? "email" : field === "password" ? "password" : "text"} 
              placeholder={field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)} 
              required 
              className="w-full p-3 my-1.5 rounded-lg border border-slate-800 bg-[#020617] text-white text-sm transition-all focus:border-sky-400 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.2)] focus:outline-none box-border"
              onChange={(e) => setForm({ ...form, [field]: e.target.value })} 
            />
          ))}
          
          <p className="text-[11px] text-gray-500 my-[15px] text-center leading-relaxed">
            People who use our service may have uploaded your contact information to our ecosystem.
            <br /><br />
            By tapping Submit, you agree to create an account and to our <Link to="/terms-and-conditions" className="text-[#00376b] no-underline">Terms</Link>, <Link to="/privacy-policy" className="text-[#00376b] no-underline">Privacy Policy</Link> and <Link to="/cookie-policy" className="text-[#00376b] no-underline">Cookies Policy</Link>.
          </p>

          <button 
            type="submit" 
            className="block w-full p-3 mt-3 rounded-lg border-none bg-gradient-to-br from-sky-400 to-sky-500 text-black font-semibold cursor-pointer transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(56,189,248,0.4)] box-border"
          >
            Submit & Sign up
          </button>
        </form>

        <p className="mt-3.5 text-[13px] text-slate-400">
          Already have an account? <Link to="/login" className="text-sky-400 no-underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;