import "../styles/legal.css";

function PrivacyPolicy() {
  return (
    <section className="legal-page">
      <div className="legal-page__container">
        <div className="legal-page__header">
          <h2>Privacy Policy</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="legal-page__content">
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you create an account, make a purchase, or contact us for support. This may include your name, email address, and phone number.</p>

          <h3>2. Payment Information</h3>
          <p>All payments are processed securely through our payment gateway partner, Razorpay. We do not store, process, or have access to your credit card details or bank account information on our servers.</p>

          <h3>3. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and communicate with you about products and updates.</p>

          <h3>4. Cookies</h3>
          <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve your browsing experience.</p>

          <h3>5. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at <strong>ialksng@gmail.com</strong>.</p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;