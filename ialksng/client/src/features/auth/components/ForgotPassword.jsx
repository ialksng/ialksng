import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../../core/utils/axios";

import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (loading) return; 

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/auth/forgot-password/send-otp", {
        email,
      });

      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        <h2>Trouble logging in?</h2>

        {message ? (
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
        ) : (
          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        <div className="auth__divider"><span>OR</span></div>

        <p className="auth__link">
          <Link to="/signup">Create new account</Link>
        </p>

        <div className="auth__bottom-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;