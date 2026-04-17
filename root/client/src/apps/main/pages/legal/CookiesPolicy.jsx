import React from 'react';
import './legal.css'; 

const CookiesPolicy = () => {
  return (
    <div className="legal__container">
      <div className="legal__content">
        <h1>Cookie Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>1. What are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>
        </section>

        <section>
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies to:</p>
          <ul>
            <li>Understand and save user's preferences for future visits.</li>
            <li>Keep track of advertisements.</li>
            <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
          </ul>
        </section>

        <section>
          <h2>3. Managing Cookies</h2>
          <p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. If you turn cookies off, some of the features that make your site experience more efficient may not function properly.</p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicy;