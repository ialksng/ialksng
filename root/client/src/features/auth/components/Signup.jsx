import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { AuthContext } from "../AuthContext";
import axios from "../../../core/utils/axios";
import "./Signup.css";

const Signup = () => {
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const signupPromise = (async () => {
      await axios.post("/auth/signup", form);
      const res = await axios.post("/auth/login", { email: form.email, password: form.password });
      return res;
    })();

    toast.promise(signupPromise, {
      loading: 'Creating your account...',
      success: (res) => {
        loginSuccess(res.data);
        navigate("/");
        return 'Account created successfully!';
      },
      error: (err) => err.response?.data?.msg || "Signup failed",
    });
  };

  const handleGoogleSuccess = async (response) => {
    const googlePromise = axios.post("/auth/google", { token: response.credential });

    toast.promise(googlePromise, {
      loading: 'Authenticating...',
      success: (res) => {
        loginSuccess(res.data);
        navigate("/");
        return 'Signup successful!';
      },
      error: 'Google signup failed',
    });
  };

  return (
    <div className="signup__container">
      <div className="signup__card">
        <h2>Create an Account</h2>
        <p className="signup__subtitle">Sign up to see projects, buy notes, and access the AI.</p>
        
        {/* Removed inline error message block */}

        <div className="signup__oauth">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => toast.error("Google Error")} 
          />
        </div>

        <div className="signup__divider"><span>OR</span></div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required 
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input type="text" placeholder="Full Name" required 
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required 
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required 
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          
          <p className="signup__legal-text">
            People who use our service may have uploaded your contact information to our ecosystem.
            <br /><br />
            By tapping Submit, you agree to create an account and to our <Link to="/terms-and-conditions">Terms</Link>, <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/cookie-policy">Cookies Policy</Link>.
          </p>

          <button type="submit">Submit & Sign up</button>
        </form>

        <p className="signup__link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;