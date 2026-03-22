import "../styles/legal.css";

function RefundPolicy() {
  return (
    <section className="legal-page">
      <div className="legal-page__container">
        <div className="legal-page__header">
          <h2>Refund & Cancellation Policy</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="legal-page__content">
          <h3>1. Digital Products</h3>
          <p>Since our website offers non-tangible, irrevocable goods (digital products, source code access, premium notes, and digital services), <strong>we do not provide refunds after the product is purchased</strong>.</p>
          <p>You acknowledge this policy prior to purchasing any product on the Website. Please make sure that you've carefully read the product description before making a purchase.</p>

          <h3>2. Delivery Policy</h3>
          <p>Upon successful payment, access to your purchased digital goods will be granted immediately via your account dashboard. Physical shipping is not applicable as all products are strictly digital.</p>

          <h3>3. Exceptional Circumstances</h3>
          <p>We realize that exceptional circumstances can take place. We may honor requests for a refund under the following highly restricted situations:</p>
          <ul>
            <li><strong>Non-delivery of the product:</strong> Due to some mailing/system issues, you do not receive a delivery email or access to the digital content.</li>
            <li><strong>Major defects:</strong> Although all products are thoroughly tested before release, unexpected errors may occur. You must contact us and provide proof of the defect.</li>
          </ul>

          <h3>4. Contact Us</h3>
          <p>If you believe your situation warrants an exception, please contact technical support at <strong>ialksng@gmail.com</strong> within 3 days of your purchase with detailed evidence.</p>
        </div>
      </div>
    </section>
  );
}

export default RefundPolicy;