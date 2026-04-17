import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookiePreferences");
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefsToSave) => {
    localStorage.setItem("cookiePreferences", JSON.stringify(prefsToSave));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleDeclineAll = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePartial = () => {
    savePreferences(preferences);
  };

  const togglePreference = (type) => {
    if (type === "essential") return;
    setPreferences(prev => ({ ...prev, [type]: !prev[type] }));
  };

  if (!isVisible && !showPreferences) return null;

  return (
    <>
      {isVisible && !showPreferences && (
        <div className="cookie-banner-container">
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <h4>Your Privacy Choices</h4>
              <p>
                We use cookies to enhance your experience, analyze site traffic, and serve tailored content. 
                You can accept all cookies, decline non-essential ones, or manage your preferences. Read our{" "}
                <Link to="/cookie-policy">Cookie Policy</Link>.
              </p>
            </div>
            <div className="cookie-banner-actions">
              <button className="btn-text" onClick={() => setShowPreferences(true)}>
                Manage
              </button>
              <button className="btn-decline" onClick={handleDeclineAll}>
                Decline All
              </button>
              <button className="btn-accept" onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreferences && (
        <div className="cookie-modal-overlay">
          <div className="cookie-modal">
            <div className="cookie-modal-header">
              <h3>Cookie Preferences</h3>
              <button className="close-btn" onClick={() => setShowPreferences(false)}>✕</button>
            </div>
            
            <div className="cookie-modal-body">
              <p className="modal-description">
                Customize your cookie preferences below. Essential cookies cannot be disabled as they are required for the website to function properly.
              </p>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <h4>Strictly Necessary (Essential)</h4>
                  <p>Required for core website functionality, security, and authentication.</p>
                </div>
                <div className="toggle disabled active">
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <h4>Analytics & Performance</h4>
                  <p>Helps us understand how visitors interact with our website to improve user experience.</p>
                </div>
                <div 
                  className={`toggle ${preferences.analytics ? "active" : ""}`} 
                  onClick={() => togglePreference("analytics")}
                >
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <h4>Marketing & Targeting</h4>
                  <p>Used to deliver personalized advertisements and track ad campaign performance.</p>
                </div>
                <div 
                  className={`toggle ${preferences.marketing ? "active" : ""}`} 
                  onClick={() => togglePreference("marketing")}
                >
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>

            <div className="cookie-modal-footer">
              <button className="btn-decline" onClick={handleDeclineAll}>
                Reject All
              </button>
              <button className="btn-accept" onClick={handleSavePartial}>
                Save My Choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;