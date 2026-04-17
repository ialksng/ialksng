import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./CookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-container">
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <h4>We value your privacy</h4>
          <p>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link to="/cookie-policy">Cookie Policy</Link> for more details.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button className="btn-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="btn-accept" onClick={handleAccept}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;