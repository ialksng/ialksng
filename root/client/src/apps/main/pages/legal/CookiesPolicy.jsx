import "./legal.css";

function CookiesPolicy() {
  return (
    <section className="legal-page">
      <div className="legal-page__container">
        
        <div className="legal-page__header">
          <h2>Cookie Policy</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="legal-page__content">
          
          <h3>1. What are Cookies?</h3>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>

          <h3>2. How We Use Cookies</h3>
          <p>We use cookies to:</p>
          <ul>
            <li>Understand and save user's preferences for future visits.</li>
            <li>Keep track of advertisements.</li>
            <li>
              Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.
            </li>
          </ul>

          <h3>3. Managing Cookies</h3>
          <p>
            You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. If you turn cookies off, some features may not function properly.
          </p>

        </div>
      </div>
    </section>
  );
}

export default CookiesPolicy;