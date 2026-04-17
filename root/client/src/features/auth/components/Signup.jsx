import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { AuthContext } from "../AuthContext";
import axios from "../../../core/utils/axios";

import "./auth.css";

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
    <div className="auth__container">
      <div className="auth__card">
        <h2>Create an Account</h2>
        <p className="auth__subtitle">Sign up to see projects, buy notes, and access the AI.</p>
        
        {error && <p className="auth__error" style={{ color: "red" }}>{error}</p>}

        <div className="auth__oauth">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Error")} />
        </div>

        <div className="auth__divider"><span>OR</span></div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required 
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input type="text" placeholder="Full Name" required 
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required 
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required 
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          
          <p className="auth__legal-text" style={{ fontSize: '11px', color: '#8e8e8e', margin: '15px 0', textAlign: 'center', lineHeight: '1.4' }}>
            People who use our service may have uploaded your contact information to our ecosystem.
            <br /><br />
            By tapping Submit, you agree to create an account and to our <Link to="/terms-and-conditions" style={{color: '#00376b'}}>Terms</Link>, <Link to="/privacy-policy" style={{color: '#00376b'}}>Privacy Policy</Link> and <Link to="/cookie-policy" style={{color: '#00376b'}}>Cookies Policy</Link>.
          </p>

          <button type="submit">Submit & Sign up</button>
        </form>

        <p className="auth__link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;