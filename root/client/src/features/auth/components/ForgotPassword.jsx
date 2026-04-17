import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../../core/utils/axios";

import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (loading) return; 

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post("/auth/forgot-password/send-otp", {
        email,
      });

      setMessage(res.data.msg);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post("/auth/forgot-password/reset", {
        email,
        otp,
        newPassword,
      });

      setMessage("Password updated successfully! You can now log in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        <h2>Trouble logging in?</h2>
        {message && <p style={{ color: "green", textAlign: "center", marginBottom: "1rem" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password (min 6 chars)"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button onClick={() => navigate("/login")}>Go to Login</button>
          </div>
        )}

        {step !== 3 && (
          <>
            <div className="auth__divider"><span>OR</span></div>

            <p className="auth__link">
              <Link to="/signup">Create new account</Link>
            </p>

            <div className="auth__bottom-link">
              <Link to="/login">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;