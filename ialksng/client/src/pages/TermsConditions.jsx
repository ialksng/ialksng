import "../styles/legal.css";

function TermsConditions() {
  return (
    <section className="legal-page">
      <div className="legal-page__container">
        <div className="legal-page__header">
          <h2>Terms & Conditions</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="legal-page__content">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. We reserve the right to refuse service to anyone for any reason at any time.</p>

          <h3>2. Intellectual Property</h3>
          <p>All content included on this site, such as digital products, source codes, text, graphics, logos, and images, is the property of Alok Singh and protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.</p>

          <h3>3. User Accounts</h3>
          <p>If you create an account on this website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.</p>

          <h3>4. Product Availability & Pricing</h3>
          <p>We offer portfolio website services, coding resources, and design templates. We reserve the right to modify or discontinue any product or service without notice. All payments are final unless explicitly stated in our Refund Policy.</p>

          <h3>5. Governing Law</h3>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Uttar Pradesh.</p>
          
          <h3>6. Contact Information</h3>
          <p>Questions about the Terms & Conditions should be sent to us at <strong>ialksng@gmail.com</strong>.</p>
        </div>
      </div>
    </section>
  );
}

export default TermsConditions;